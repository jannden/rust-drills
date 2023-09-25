import { NextResponse } from 'next/server'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/utils'

import { ChatPUT } from './validations'
import { ChatMessageType } from '../memories/validations'

// * Updating chat
export async function PATCH(req: Request): Promise<NextResponse<{ error: string } | null>> {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = ChatPUT.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  try {
    const chat = await prisma.memory.findUniqueOrThrow({
      where: {
        id: body.data.chatId,
        userId: user.db.id,
      },
    })

    const oldMessages = (chat.openaiChat as ChatMessageType[]) ?? []
    const newMessages = JSON.parse(body.data.content) as ChatMessageType[]
    const updatedContent = [...oldMessages, ...newMessages]

    await prisma.memory.update({
      where: {
        id: body.data.chatId,
        userId: user.db.id,
      },
      data: {
        openaiChat: updatedContent,
      },
    })
  } catch (error) {
    const publicErrorMessage = 'Internal server error'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  return NextResponse.json(null, { status: 200 })
}
