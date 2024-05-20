'use client'

import { useState } from 'react'

import { useChat } from 'ai/react'

import { defaultAI } from '@/lib/config/ai'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'

import Dialogue from './Dialogue'
import DialogueForm from './DialogueForm'
import { StoryMessage } from './page'
import UserAvatar from '@/components/UserAvatar'
import Alert, { AlertVariant } from '@/components/Alert'
import { CircleAlert, Hourglass } from 'lucide-react'
import { ClerkLoaded, ClerkLoading, useUser } from '@clerk/nextjs'

export const codify = (content: string) => {
  return content.startsWith('```') ? content : '```rust\n' + content + '\n```'
}

export default function Chat({
  deckSlug,
  snippetId,
  memoryId,
  promptId,
  initialMessages,
}: {
  deckSlug: string
  snippetId: string
  memoryId: string
  promptId: string
  initialMessages: StoryMessage[]
}) {
  const user = useUser()
  const [errorMessage, setErrorMessage] = useState('')
  const [energyTimestamp, setEnergyTimestamp] = useState<number>(Date.now())

  const {
    reload,
    messages,
    handleSubmit,
    isLoading: isLoadingContent,
    input,
    handleInputChange,
  } = useChat({
    id: memoryId,
    api: '/api/ai',
    initialMessages: [
      ...(!!initialMessages?.length
        ? []
        : [
            {
              id: '1',
              content: 'Start',
              role: 'system' as const,
            },
          ]),
      ...initialMessages.map((m, index) => ({
        id: index.toString(),
        content: m.sentences.join(' '),
        role: m.avatar as 'user' | 'assistant' | 'system',
      })),
    ],
    body: {
      stream: true,
      memoryId,
      promptId,
      maxTokens: defaultAI.maxTokens.default,
    },
    onError: (error) => {
      setErrorMessage(error.message)
    },
    onFinish: async (message) => {
      // Update completion to save used tokens
      const responseSaveCompletion = await fetch('/api/prompts', {
        method: 'PATCH',
        body: JSON.stringify({
          memoryId,
          completion: JSON.stringify(message),
        }),
      })
      if (!responseSaveCompletion.ok) {
        try {
          const data = await responseSaveCompletion.json()
          setErrorMessage(data.error)
        } catch (error) {
          setErrorMessage(`error: ${error}`)
        }
        return
      }

      try {
        await fetch('/api/chats', {
          method: 'PATCH',
          body: JSON.stringify({
            memoryId,
            content: JSON.stringify([
              ...(input
                ? [
                    {
                      content: codify(input),
                      role: 'user',
                    },
                  ]
                : []),
              {
                content: message.content,
                role: message.role,
              },
            ]),
          }),
        })
      } catch (error) {
        setErrorMessage(`error: ${error}`)
      }

      setEnergyTimestamp(Date.now())
    },
  })

  const requireStart = initialMessages.length < 1 && messages?.length < 2

  const handleStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    reload()
  }

  return (
    <div className="flow-root">
      {requireStart ? (
        <form onSubmit={handleStart}>
          <Button type={ButtonType.Submit} variant={ButtonVariant.Primary}>
            Start
          </Button>
        </form>
      ) : (
        <>
          <Dialogue
            messages={
              messages
                .map((m) => {
                  if (m.role === 'assistant') {
                    return {
                      avatar: m.role,
                      sentences: [m.content],
                    }
                  }
                  if (m.role === 'user') {
                    return {
                      avatar: m.role,
                      sentences: [codify(m.content)],
                    }
                  }
                  return null
                })
                .filter((m) => m !== null) as StoryMessage[]
            }
          />
          {errorMessage && (
            <div className="mt-6 flex gap-x-3">
              <div className="relative">
                <div className="rounded-full bg-white p-1.5 ring-8 ring-white">
                  <CircleAlert className="size-7" />
                </div>
              </div>
              <Alert variant={AlertVariant.Red} message={errorMessage} />
            </div>
          )}
          <div className="flex items-center gap-3 my-6 sm:hidden">
            <UserAvatar />
            <div className="flex-1 text-sm font-medium text-gray-900">{user.user?.firstName}</div>
          </div>
          <div className="mt-6 flex gap-x-3">
            <div className="hidden sm:block">
              <div className="flex rounded-full bg-white ring-8 ring-white">
                <UserAvatar />
              </div>
            </div>
            {!!messages?.find(
              (m) => m.role === 'assistant' && m.content?.includes('We finished drilling this one!')
            ) ? (
              <Button type={ButtonType.Link} variant={ButtonVariant.Primary} href={`/decks/${deckSlug}#${snippetId}`}>
                Back to drills
              </Button>
            ) : (
              <DialogueForm
                handleSubmit={handleSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isLoadingContent={isLoadingContent}
                energyTimestamp={energyTimestamp}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
