'use client'

import React, { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { BookOpen, Loader2 } from 'lucide-react'

import { useMounted } from '@/lib/hooks/use-mounted'
import {
  MemoryGETResponseType,
  MemoryInfoType,
  MemoryPUTRequestType,
  MemoryPUTResponseType,
} from '@/app/api/memories/validations'
import Alert, { AlertVariant } from '@/components/user/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/user/Button'
import CircularProgress from '@/components/user/CircularProgress'
import Heading from '@/components/user/Heading'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

type Props = {
  articleId?: string
  articleTitle?: string
}

export default function Blackboard({ articleId, articleTitle }: Props) {
  const mounted = useMounted()
  const [currentMemory, setCurrentMemory] = React.useState<MemoryInfoType | null>(null)
  const [learnedPercentage, setLearnedPercentage] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

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
    if (!mounted) return
    getNextMemory().then(setCurrentMemory)
  }, [getNextMemory, mounted])

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

      getNextMemory().then(setCurrentMemory)
    },
    [currentMemory, getNextMemory]
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
          Open list of topics
        </Button>
      </>
    )
  }

  if (!currentMemory) {
    return (
      <>
        <Alert variant={AlertVariant.Blue} message={`No snippets to repeat.`} />
        <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/articles`}>
          Open list of topics
        </Button>
      </>
    )
  }

  return (
    <>
      {articleId ? (
        <>
          <Heading heading={`Snippet from: "${articleTitle}"`} className="border-0">
            {learnedPercentage !== null ? (
              <CircularProgress percent={learnedPercentage}>
                <BookOpen className="size-3 flex-none text-gray-400" aria-hidden="true" />
              </CircularProgress>
            ) : null}
          </Heading>
          <h4 className="mb-3 text-xl font-semibold leading-6 text-gray-900 [text-wrap:balance]">
            {currentMemory.snippetHeading}
          </h4>
        </>
      ) : (
        <Heading heading="Repeating learned snippets" />
      )}

      {currentMemory && (
        <>
          <div className="mb-6">
            <ReactMarkdown className="prose" rehypePlugins={[rehypeHighlight]}>
              {currentMemory.snippetContent}
            </ReactMarkdown>
          </div>
          <div className="flex justify-between">
            <Button
              variant={ButtonVariant.Primary}
              type={ButtonType.Link}
              href={`/drills/${currentMemory.memoryId}/stream`}
            >
              Drill Stream
            </Button>
            <div className="flex gap-1">
              <Button
                variant={ButtonVariant.Secondary}
                type={ButtonType.Button}
                onClick={() => saveAndMoveToNextMemory(2)}
              >
                Repeat soon
              </Button>
              <Button
                variant={ButtonVariant.Secondary}
                type={ButtonType.Button}
                onClick={() => saveAndMoveToNextMemory(1)}
              >
                Repeat later
              </Button>
              <Button
                variant={ButtonVariant.Secondary}
                type={ButtonType.Button}
                onClick={() => saveAndMoveToNextMemory(0)}
              >
                Repeat never
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
