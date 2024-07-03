import { spacedRepetitionAlgorithm } from '@/lib/algorithm'
import { algorithmDefaults, isLearnedIfIntervalDays } from '@/lib/config/sr'
import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { AlgorithmInput } from '@/lib/types'
import {
  ChatMessageType,
  MemoryDELETERequest,
  MemoryPUTRequest,
  MemoryPUTResponseType,
} from '@/app/api/memories/validations'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/utils'

// * Saves the memory for a user
export async function PUT(req: Request): Promise<NextResponse<MemoryPUTResponseType | { error: string }>> {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = MemoryPUTRequest.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  const { categorySlug, deckSlug, snippetSlug, numberOfMistakes } = body.data

  let foundMemory: Prisma.MemoryGetPayload<{ include: { user: true } }> | null = null
  try {
    foundMemory = await prisma.memory.findFirst({
      where: {
        deckSlug,
        snippetSlug,
        user: { id: user.db.id },
      },
      include: {
        user: true,
      },
    })
  } catch (error) {
    const publicErrorMessage = 'Error looking up memory'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  let newItemLearned = false
  if (!foundMemory?.dateTimeRepeated && numberOfMistakes === 0) {
    newItemLearned = true
  }

  // Update streak
  if (numberOfMistakes === 0) {
    const startOfToday = DateTime.utc().startOf('day').toISO()
    const startOfYesterday = DateTime.utc().minus({ days: 1 }).startOf('day').toISO()

    try {
      const dayStreakExists = await prisma.streak.findFirst({
        where: {
          userId: user.db.id,
          lastDate: startOfToday,
        },
      })

      const updatedStreak = await prisma.streak.updateMany({
        where: {
          userId: user.db.id,
          lastDate: {
            gte: startOfYesterday,
          },
        },
        data: {
          ...(!dayStreakExists && {
            daysCount: {
              increment: 1,
            },
          }),
          todayLearnedCount: {
            increment: 1,
          },
          lastDate: startOfToday,
        },
      })

      if (updatedStreak.count === 0) {
        await prisma.streak.create({
          data: {
            userId: user.db.id,
            lastDate: startOfToday,
          },
        })
      }
    } catch (error) {
      const publicErrorMessage = 'Error updating streak'
      logError(publicErrorMessage, error)
      return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
    }
  }

  const algorithmInput: AlgorithmInput = {
    repetition: foundMemory?.repetition || algorithmDefaults.repetition,
    eFactor: Number(foundMemory?.eFactor || algorithmDefaults.eFactor),
    interval: Number(foundMemory?.interval || algorithmDefaults.interval),
    dateTimePlanned: foundMemory?.dateTimePlanned?.toISOString() || algorithmDefaults.dateTimePlanned,
  }

  const algorithmOutput = spacedRepetitionAlgorithm(algorithmInput, numberOfMistakes)

  const nowLuxon = DateTime.utc().toISO()
  const now = nowLuxon ? new Date(nowLuxon) : new Date()

  const isLearned = algorithmOutput.interval === isLearnedIfIntervalDays ? true : false

  const updatedMemory = {
    repetition: algorithmOutput.repetition,
    eFactor: algorithmOutput.eFactor,
    interval: algorithmOutput.interval,
    dateTimePlanned: algorithmOutput.dateTimePlanned,
    dateTimeRepeated: now,
    dateTimeLastMistake:
      numberOfMistakes > 0 ? new Date(DateTime.utc().toISO() ?? '') : foundMemory?.dateTimeLastMistake,
    numberOfMistakes: {
      push: numberOfMistakes,
    },
    isLearned,
  }

  const initialMessages: ChatMessageType[] = [
    {
      role: 'system' as const,
      content: 'TK',
      metadata: { hidden: true },
    },
    {
      role: 'user' as const,
      content: 'TK',
      metadata: { hidden: true },
    },
  ]

  const newMemory = {
    ...updatedMemory,
    categorySlug,
    deckSlug,
    snippetSlug,
    userId: user.db.id,
    numberOfMistakes: [numberOfMistakes],
    openaiChat: initialMessages,
  }

  try {
    if (!foundMemory?.id) {
      await prisma.memory.create({
        data: newMemory,
      })
    } else {
      await prisma.memory.update({
        where: {
          id: foundMemory.id,
        },
        data: updatedMemory,
      })
    }
  } catch (error) {
    const publicErrorMessage = 'Error saving memory'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  revalidatePath('/')

  return NextResponse.json(
    { newItemLearned, dateTimePlanned: newMemory.dateTimePlanned, isLearned: newMemory.isLearned },
    { status: 200 }
  )
}

// * Deletes the memory for a user
export async function DELETE(req: Request): Promise<NextResponse<{ error?: string }>> {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = MemoryDELETERequest.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  const { deckSlug, snippetSlug } = body.data

  try {
    await prisma.memory.deleteMany({
      where: {
        deckSlug,
        snippetSlug,
        userId: user.db.id,
      },
    })
  } catch (error) {
    const publicErrorMessage = 'Error deleting memory'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  return NextResponse.json({}, { status: 200 })
}
