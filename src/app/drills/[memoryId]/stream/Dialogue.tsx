'use client'

import Image from 'next/image'

import logoSvg from '@/images/logo.svg'
import { StoryMessage } from './page'
import UserAvatar from '@/components/UserAvatar'
import ReactMarkdown from 'react-markdown'
import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { env } from '@/env.mjs'

import rehypeHighlight from 'rehype-highlight'
import { LogoIcon } from '@/components/Logo'

type Props = { messages: StoryMessage[] }

export default function Dialogue({ messages }: Props) {
  const user = useUser()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ul role="list">
      {messages.map((message, index) => (
        <li key={index}>
          <div className="border-b-2 border-stone-200 py-6 sm:relative sm:border-0">
            <span
              className="absolute left-4 top-4 -ml-px hidden h-full w-0.5 bg-gray-200 sm:block"
              aria-hidden="true"
            />
            <div className="flex items-start sm:relative sm:space-x-3">
              <div className="hidden rounded-full bg-white ring-8 ring-white sm:flex">
                {message.avatar === 'user' ? (
                  <UserAvatar />
                ) : (
                  <div className="rounded-full bg-stone-50 p-2">
                    <LogoIcon />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="sm:hidden">
                    {message.avatar === 'user' ? (
                      <UserAvatar />
                    ) : (
                      <div className="rounded-full bg-stone-50 p-2">
                        <LogoIcon />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-sm font-medium text-gray-900">
                    {message.avatar === 'user' ? user.user?.firstName : env.NEXT_PUBLIC_APP_NAME}
                  </div>
                </div>
                <div className="mt-2 text-gray-700">
                  {message.sentences.map((sentence, index2) =>
                    !!sentence ? (
                      <ReactMarkdown key={index2} className="prose" rehypePlugins={[rehypeHighlight]}>
                        {sentence}
                      </ReactMarkdown>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
