'use client'

import { useState } from 'react'

import { useChat } from 'ai/react'

import { defaultAI } from '@/lib/config/ai'
import Button, { ButtonType, ButtonVariant } from '@/components/user/Button'

import Dialogue from './Dialogue'
import DialogueForm from './DialogueForm'
import { StoryMessage } from './page'
import UserAvatar from '@/components/user/UserAvatar'

export default function Chat({
  chatId,
  promptId,
  articleId,
  initialMessages,
}: {
  chatId: string
  promptId: string
  articleId: string
  initialMessages: StoryMessage[]
}) {
  const [errorMessage, setErrorMessage] = useState('')

  const {
    reload,
    messages,
    handleSubmit,
    isLoading: isLoadingContent,
    input,
    handleInputChange,
  } = useChat({
    id: chatId,
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
      chatId,
      promptId,
      maxTokens: defaultAI.maxTokens.default,
      promptType: 'chat',
    },
    onError: (error) => {
      setErrorMessage(error.message)
    },
    onFinish: async (message) => {
      // Update completion to save used tokens
      const responseSaveCompletion = await fetch('/api/prompts', {
        method: 'PATCH',
        body: JSON.stringify({
          chatId,
          promptType: 'chat',
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
            chatId,
            content: JSON.stringify([
              ...(input
                ? [
                    {
                      content: input,
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
    },
  })

  const requireStart = initialMessages.length < 1 && messages?.length < 2

  const handleStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    reload()
  }

  return (
    <div className="flow-root">
      {errorMessage && (
        <div className="mb-6">
          <p className="text-sm text-gray-500">{errorMessage}</p>
        </div>
      )}
      {requireStart ? (
        <form onSubmit={handleStart}>
          <Button type={ButtonType.Submit} variant={ButtonVariant.Primary}>
            Start chat
          </Button>
        </form>
      ) : (
        <>
          <Dialogue
            messages={
              messages
                .map((m) => {
                  if (m.role !== 'system') {
                    return {
                      avatar: m.role,
                      sentences: [m.content],
                    }
                  }
                  return null
                })
                .filter((m) => m !== null) as StoryMessage[]
            }
          />
          <div className="mt-6 flex gap-x-3">
            <div className="relative">
              <div className="flex rounded-full bg-white ring-8 ring-white">
                <UserAvatar />
              </div>
            </div>
            {!!messages?.find((m) => m.content?.includes('We finished drilling this one!')) ? (
              <Button type={ButtonType.Link} variant={ButtonVariant.Primary} href={`/lesson/${articleId}`}>
                Back to drills
              </Button>
            ) : (
              <DialogueForm
                handleSubmit={handleSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isLoadingContent={isLoadingContent}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
