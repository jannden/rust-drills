import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Alert, { AlertVariant } from '@/components/Alert'
import Heading from '@/components/Heading'
import Chat from './Chat'
import { defaultAI } from '@/lib/config/ai'
import { ChatMessageType } from '@/app/api/memories/validations'

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

  if (!params.memoryId) {
    return <Alert message="Thread ID is missing" variant={AlertVariant.Red} />
  }

  let memory = await prisma.memory.findUnique({
    where: {
      id: params.memoryId,
      userId: user.db.id,
    },
    include: {
      snippet: {
        include: {
          deck: true,
        },
      },
      prompts: true,
    },
  })

  if (!memory) {
    return <Alert message="The drill does not exist or you don't have access to it." variant={AlertVariant.Red} />
  }

  let promptId = memory.prompts?.[0]?.id
  if (!promptId) {
    const initialMessages = [
      {
        role: 'system' as const,
        content: `
        As a tutor in Rust programming, you'll guide the user through learning to code in Rust efficiently.
        1. You will be provided a code snippet delimited by triple hashtags bellow. There will be an indication which parts of the code snippet is the user supposed to write for practice. The starting points will be '/* TODO:' excluding the quotes; and the ending points will be '*/' excluding the quotes.
        2. Important: You will show the user the whole code snippet with those parts they are supposed to write cut out with an appropriate comment!
        3. You will tell the user in plain English what the code snippet does as briefly as possible without going into too much details.
        4. You will break down the parts that the user should write into logical pieces, focusing on single expressions or statements and bypassing comments. For simpler segments, you might combine expressions together for efficiency. You will describe a logical piece in plain English, avoiding direct code examples. Challenge the user to write the piece.
        5. The user will try coding it. If the user is close to the desired code but not quite there, you'll provide hints to steer them right. If they've got it right, you'll move to the next segment. If they've almost got it (with just minor deviations), you will accept their answer but show them a corrected version before moving to the next segment. Otherwise, you nudge them towards the right solution and let them try again.
        6. After the user manages to write the whole code part they am supposed to, congratulate them and end the conversation with "We finished drilling this one!". Ignore any other of my messages and just keep repeating "We finished drilling this one!".
        Let the user ask questions at any point as this is a two-way learning process. Your goal is to make learning Rust engaging, comprehensive, and tailored to the user's pace. Give positive feedback to reinforce the learning progress, and adapt the teaching style based on how quickly the user grasps the concepts.
        The provided code snippet for practice is the following:
        ###
        ${memory.snippet.content}
        ###
        Your output should start with: "We are going to drill a code snippet that "
        `,
        metadata: {
          hidden: true,
        },
      },
      {
        role: 'assistant' as const,
        content: memory.snippet.task,
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
        snippet: {
          include: {
            deck: true,
          },
        },
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
      <Heading
        heading={`Drilling ${memory.snippet.heading}`}
        back={`/decks/${memory.snippet.deck.slug}#${memory.snippet.id}`}
      />
      <Chat
        deckSlug={memory.snippet.deck.slug}
        snippetId={memory.snippet.id}
        memoryId={memory.id}
        promptId={promptId}
        initialMessages={messages}
      />
    </div>
  )
}
