'use client'

import React, { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { BookOpen, Loader2, Pen } from 'lucide-react'

import { useMounted } from '@/lib/hooks/use-mounted'
import {
  MemoryGETResponseType,
  MemoryInfoType,
  MemoryPUTRequestType,
  MemoryPUTResponseType,
} from '@/app/api/memories/validations'
import Alert, { AlertVariant } from '@/components/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import CircularProgress from '@/components/CircularProgress'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
  articleId?: string
  articleTitle?: string
  isAdmin: boolean
  memoryPreview: MemoryInfoType | null
}

export default function Blackboard({ articleId, articleTitle, isAdmin, memoryPreview }: Props) {
  const mounted = useMounted()
  const router = useRouter()
  const [currentMemory, setCurrentMemory] = React.useState<MemoryInfoType | null>(memoryPreview)
  const [learnedPercentage, setLearnedPercentage] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(!!memoryPreview === false)
  const [showTask, setShowTask] = React.useState(false)

  const getNextMemory = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/memories/?articleId=${articleId}`)
      const data = (await res.json()) as MemoryGETResponseType | { error: string }

      // If error
      if ('error' in data) {
        console.error('error ----->', data.error)
        setIsLoading(false)
        return null
      }

      setIsLoading(false)
      setLearnedPercentage(data.learnedPercentage)
      return data.data
    } catch (error) {
      setIsLoading(false)
      console.error('error ----->', error)
      return null
    }
  }, [articleId])

  useEffect(() => {
    if (!mounted || !!memoryPreview) return
    getNextMemory().then(setCurrentMemory)
  }, [getNextMemory, memoryPreview, mounted])

  const saveAndMoveToNextMemory = React.useCallback(
    async (numberOfMistakes: number) => {
      if (!currentMemory) return

      const reqBody: MemoryPUTRequestType = {
        snippetId: currentMemory.snippetId,
        numberOfMistakes,
      }

      setIsLoading(true)
      const result = await fetch(`/api/memories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(reqBody),
      })

      const data = (await result.json()) as MemoryPUTResponseType

      if (data.newItemLearned) {
        toast('New snippet learned.')
      }

      if (data.newBadgeEarned) {
        toast('New badge earned', {
          autoClose: false,
          closeOnClick: true,
          draggable: true,
        })
      }

      if (!!memoryPreview) {
        router.push(`/articles/${articleId}`)
        return
      }

      getNextMemory().then(setCurrentMemory)
    },
    [articleId, currentMemory, getNextMemory, memoryPreview, router]
  )

  if (isLoading) {
    return (
      <div className="flex justify-center pt-24">
        <Loader2 className="size-10 animate-spin text-slate-200" />
      </div>
    )
  }

  if (!currentMemory && articleId) {
    return (
      <>
        <Alert variant={AlertVariant.Green} message={`All snippets from this article learned.`} />
        <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/articles`}>
          Open list of articles
        </Button>
      </>
    )
  }

  if (!currentMemory) {
    return (
      <>
        <Alert variant={AlertVariant.Blue} message={`No snippets to repeat.`} />
        <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/articles`}>
          Open list of articles
        </Button>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-x-6 sm:flex-nowrap">
          <h3 className="mb-3 text-2xl font-semibold leading-6 text-gray-900 [text-wrap:balance]">{`${articleTitle}: ${currentMemory.snippetHeading}`}</h3>
          <div className="mt-3 flex shrink-0 gap-3 sm:ml-3 sm:mt-0">
            <Button variant={ButtonVariant.Secondary} type={ButtonType.Link} href={`/articles/${articleId}`}>
              Back
            </Button>
            {isAdmin ? (
              <Button
                variant={ButtonVariant.Primary}
                type={ButtonType.Link}
                href={`/snippet/${currentMemory.snippetId}/edit`}
              >
                Edit
              </Button>
            ) : null}
            {learnedPercentage !== null ? (
              <CircularProgress percent={learnedPercentage}>
                <BookOpen className="size-3 flex-none text-gray-400" aria-hidden="true" />
              </CircularProgress>
            ) : null}
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <nav className="-mb-px flex space-x-8">
            <button
              className={cn(
                !showTask
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 pb-4 text-sm font-medium'
              )}
              aria-current={!showTask ? 'page' : undefined}
              onClick={() => setShowTask(false)}
            >
              Explanation
            </button>
            <button
              className={cn(
                showTask
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 pb-4 text-sm font-medium'
              )}
              aria-current={showTask ? 'page' : undefined}
              onClick={() => setShowTask(true)}
            >
              Task
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-6">
        <ReactMarkdown className={cn(showTask && 'hidden', 'prose')} rehypePlugins={[rehypeHighlight]}>
          {currentMemory.snippetContent}
        </ReactMarkdown>
        <ReactMarkdown className={cn(!showTask && 'hidden', 'prose')} rehypePlugins={[rehypeHighlight]}>
          {currentMemory.snippetTask}
        </ReactMarkdown>
      </div>

      <div className="flex justify-between">
        <Button
          variant={ButtonVariant.Primary}
          type={ButtonType.Link}
          href={`/drills/${currentMemory.memoryId}/stream`}
        >
          Drill
        </Button>
        <div className="flex gap-1">
          <Button variant={ButtonVariant.Secondary} type={ButtonType.Button} onClick={() => saveAndMoveToNextMemory(2)}>
            Repeat soon
          </Button>
          <Button variant={ButtonVariant.Secondary} type={ButtonType.Button} onClick={() => saveAndMoveToNextMemory(1)}>
            Repeat later
          </Button>
          <Button variant={ButtonVariant.Secondary} type={ButtonType.Button} onClick={() => saveAndMoveToNextMemory(0)}>
            Repeat never
          </Button>
        </div>
      </div>
    </>
  )
}
