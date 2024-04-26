import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { openai } from '@/lib/openai'
import { defaultAI } from '@/lib/config/ai'
import { getEnergy } from '@/lib/server/getEnergy'

import Alert, { AlertVariant } from '@/components/Alert'
import Heading from '@/components/Heading'
import Energy from '@/components/Energy'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import UserAvatar from '@/components/UserAvatar'

import DialogueForm from './DialogueForm'
import Dialogue from './Dialogue'
import { startThread } from './actions'

export type StoryMessage = {
  avatar: string
  sentences: string[]
}

export type MessageData = {
  id: string
  created_at: number
  role: string
  content: {
    type: string
    text: {
      value: string
    }
  }[]
  metadata?: {
    hidden?: boolean
  }
}

type Props = {
  params: {
    memoryId: string
  }
}

export default async function ThreadDetailPage({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user) {
     redirect('/sign-up')
  }

  if (!params.memoryId) {
    return <Alert message="Memory ID missing" variant={AlertVariant.Red} />
  }

  const memory = await prisma.memory.findUnique({
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
    },
  })

  if (!memory) {
    return <Alert message="Memory not found" variant={AlertVariant.Red} />
  }

  const energyData = await getEnergy(user.db.role === 'ADMIN', user.db.id)
  if (!energyData) {
    return <Alert message="No energy data" variant={AlertVariant.Red} />
  }

  let pageContent = (
    <form action={startThread}>
      <input type="hidden" name="memoryId" value={memory.id} />
      <Button type={ButtonType.Submit} variant={ButtonVariant.Primary}>
        Start drilling
      </Button>
    </form>
  )

  let openaiThreadId = memory?.openaiThreadId
  if (!!openaiThreadId) {
    const messages = await openai.beta.threads.messages.list(openaiThreadId)
    const messagesData = messages.data as MessageData[]

    const formattedMessages = messagesData
      .filter((message) => !message.metadata?.hidden)
      .sort((a, b) => a.created_at - b.created_at)
      .map((message) => ({
        avatar: message.role,
        sentences: message.content.map((content) => (content.type === 'text' ? content.text.value : '')),
      }))

    pageContent = (
      <div className="flow-root">
        <Dialogue messages={formattedMessages} />
        <div className="mt-6 flex gap-x-3">
          <div className="relative">
            <div className="flex rounded-full bg-white ring-8 ring-white">
              <UserAvatar />
            </div>
          </div>
          {energyData.energy < defaultAI.maxTokens.default ? (
            <Alert message="Missing energy" variant={AlertVariant.Yellow} />
          ) : (
            <DialogueForm memoryId={memory.id} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      <Heading heading={memory.snippet.deck.title}>
        <Energy energyTimestamp={0} />
      </Heading>
      {pageContent}
    </div>
  )
}
