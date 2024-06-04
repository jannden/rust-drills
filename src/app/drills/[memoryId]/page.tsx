import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Alert, { AlertVariant } from '@/components/Alert'
import Heading from '@/components/Heading'
import Chat from './Chat'
import { defaultAI } from '@/lib/config/ai'
import { ChatMessageType } from '@/app/api/memories/validations'
import { getSnippetBySlugs, loadMdx } from '@/lib/server/getBySlugs'
import { ContentVariant } from '@/lib/types'

export type StoryMessage = {
  avatar: string
  sentences: string[]
}

type Props = {
  params: {
    memoryId: string
  }
}

export default async function ChatDetailPage({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/sign-up')
  }

  let memory = await prisma.memory.findUnique({
    where: {
      id: params.memoryId,
      userId: user.db.id,
    },
    include: {
      prompts: {
        where: {
          restartedAt: null,
        },
      },
    },
  })

  if (!memory) {
    return <Alert message="The drill does not exist or you don't have access to it." variant={AlertVariant.Red} />
  }

  const snippet = await getSnippetBySlugs(memory.deckSlug, memory.snippetSlug)
  if (!snippet) {
    return <Alert message="Snippet not found." variant={AlertVariant.Red} />
  }

  const contentExplanation = await loadMdx(memory.deckSlug, memory.snippetSlug, ContentVariant.explanation)
  const contentTask = await loadMdx(memory.deckSlug, memory.snippetSlug, ContentVariant.task)
  const contentSnippet = await loadMdx(memory.deckSlug, memory.snippetSlug, ContentVariant.snippet)

  let promptId = memory.prompts?.[0]?.id
  if (!promptId) {
    const initialMessages = [
      {
        role: 'system' as const,
        content: `
        As a tutor in Rust programming, you'll guide me through learning to code in Rust efficiently.
        Bellow is a short Rust concept explanation delimited by triple hashtags so that you have a clear understanding of what we are going to code. I have seen that explanation, but now it will be hidden from me.
        I will be presented a task with a plan of action.
        I will try coding according to the plan of action. If I get it wrong, you'll provide hints to steer me right. If I almost got it (with just minor deviations), you will accept my answer but show them a corrected version. Otherwise, you nudge them towards the right solution and let them try again.
        After we are done, congratulate me and end the conversation with "We finished drilling this one!". Ignore any other of my messages and just keep repeating "We finished drilling this one!".
        Your goal is to make learning Rust engaging, comprehensive, and tailored to the my pace. Give positive feedback to reinforce the learning progress, and adapt the teaching style based on how quickly I grasp the concepts.
        The provided code snippet for practice is the following:
        ###
        ${contentExplanation}
        ###`,
        metadata: {
          hidden: true,
        },
      },
      {
        role: 'assistant' as const,
        content: contentTask,
        metadata: {
          hidden: false,
        },
      },
    ]
    const prompt = await prisma.prompt.create({
      data: {
        model: defaultAI.model,
        prompt: initialMessages,
        promptTokens: 0,
        temperature: 0.7,
        userId: user.db.id,
        maxTokens: defaultAI.maxTokens.default,
        memoryId: memory.id,
      },
    })
    promptId = prompt.id

    memory = await prisma.memory.update({
      where: {
        id: memory.id,
      },
      data: {
        openaiChat: initialMessages,
      },
      include: {
        prompts: true,
      },
    })
  }

  let messages: StoryMessage[] = []
  if (memory.openaiChat) {
    const chatContent = memory.openaiChat as ChatMessageType[]
    messages = chatContent
      .map((message) => {
        if (message.metadata?.hidden) return null
        return {
          avatar: message?.role as string,
          sentences: [message?.content] as string[],
        }
      })
      .filter((message) => !!message) as StoryMessage[]
  }

  return (
    <div className="pb-12">
      <Heading heading={`Drilling ${snippet.heading}`} back={`/decks/${snippet.deckSlug}#${snippet.snippetSlug}`} />
      <Chat
        deckSlug={snippet.deckSlug}
        snippetSlug={snippet.snippetSlug}
        memoryId={memory.id}
        promptId={promptId}
        initialInput={contentSnippet}
        initialMessages={messages}
      />
    </div>
  )
}
