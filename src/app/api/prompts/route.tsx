import { NextResponse } from 'next/server'
import { encode } from 'gpt-tokenizer'

import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/utils'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'

import { PromptsDELETE, PromptsPATCH } from './validations'
import { revalidatePath } from 'next/cache'

// * Quality
// Update completion (used tokens and completion text)
export async function PATCH(req: Request): Promise<NextResponse<{ error: string } | null>> {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = PromptsPATCH.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  try {
    const completionTokens = encode(body.data.completion).length

    let where
    if (body.data.promptId) {
      where = {
        id: body.data.promptId,
        userId: user.db.id,
      }
    } else {
      where = {
        userId: user.db.id,
        completionTokens: null,
        createdAt: {
          gte: new Date(new Date().getTime() - 1000 * 60 * 10),
        },
        memoryId: body.data.memoryId,
        openaiThreadId: body.data.openaiThreadId,
      }
    }

    await prisma.prompt.updateMany({
      where,
      data: {
        completion: body.data.completion,
        completionTokens,
      },
    })

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }
}

export async function DELETE(req: Request): Promise<NextResponse<{ error: string } | null>> {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = PromptsDELETE.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  const { memoryId } = body.data

  try {
    await prisma.prompt.updateMany({
      data: {
        restartedAt: new Date(),
      },
      where: {
        userId: user.db.id,
        memoryId: memoryId,
        restartedAt: null,
      },
    })

    revalidatePath(`/drills`)

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }
}
