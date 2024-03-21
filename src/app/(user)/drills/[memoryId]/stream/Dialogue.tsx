'use client'

import Image from 'next/image'

import logoSvg from '@/images/logo.svg'
import { StoryMessage } from './page'
import UserAvatar from '@/components/user/UserAvatar'
import ReactMarkdown from 'react-markdown'
import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { env } from '@/env.mjs'

import rehypeHighlight from 'rehype-highlight'

type Props = { messages: StoryMessage[] }

export default function Dialogue({ messages }: Props) {
  const user = useUser()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ul role="list" className="-mb-8">
      {messages.map((message, index) => (
        <li key={index}>
          <div className="relative pb-8">
            <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
            <div className="relative flex items-start space-x-3">
              <div className="flex rounded-full bg-white ring-8 ring-white">
                {message.avatar === 'user' ? (
                  <UserAvatar />
                ) : (
                  <div className="rounded-full bg-zinc-50 p-2">
                    <Image src={logoSvg} alt={`Assistant`} aria-hidden="true" height={20} width={20} />{' '}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex-1 text-sm font-medium text-gray-900">
                  {message.avatar === 'user' ? user.user?.firstName : env.NEXT_PUBLIC_APP_NAME}
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
