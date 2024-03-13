import { spacedRepetitionAlgorithm } from '@/lib/algorithm'
import { algorithmDefaults } from '@/lib/config/global'
import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { AlgorithmInput } from '@/lib/types'
import {
  ChatMessageType,
  MemoryGETRequest,
  MemoryGETResponseType,
  MemoryInfoType,
  MemoryPUTRequest,
  MemoryPUTResponseType,
} from '@/app/api/memories/validations'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/utils'
import { getBadges } from '@/lib/server/getBadges'

// * Get next memory in queue
export async function GET(req: Request): Promise<NextResponse<MemoryGETResponseType | { error: string }>> {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const body = MemoryGETRequest.safeParse({
    articleId: searchParams.get('articleId') ?? undefined,
  })
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  const { articleId } = body.data

  let memories: MemoryInfoType[] | null = null
  try {
    memories = await prisma.$queryRaw`
      SELECT 
        "Snippet"."id" as "snippetId",
        "Snippet"."heading" as "snippetHeading",
        "Snippet"."content" as "snippetContent",
        "Snippet"."task" as "snippetTask",
        "Memory"."id" as "memoryId",
        "Memory"."openaiChat" as "memoryChat"
      FROM "Snippet"
      LEFT JOIN "Memory"
        ON "Memory"."userId" = ${user.db.id}
        AND "Memory"."snippetId" = "Snippet"."id"
      ${!articleId ? Prisma.sql` WHERE ` : Prisma.sql` WHERE "Snippet"."articleId" = ${articleId} AND`}

      ${
        articleId
          ? Prisma.sql`
          -- Both new and to be repeated
          (
            (
              "Memory"."dateTimeRepeated" IS NOT NULL
              AND "Memory"."dateTimePlanned" < NOW() + INTERVAL '1 day'
            )
            OR "Memory"."dateTimeRepeated" IS NULL
          )`
          : Prisma.sql`
          -- Only to be repeated
          (
            "Memory"."dateTimeRepeated" IS NOT NULL
            AND "Memory"."dateTimePlanned" < NOW() + INTERVAL '1 day'
          )`
      }

      GROUP BY
        "Snippet"."id",
        "Memory"."id"
      ORDER BY
        CASE
          WHEN
            -- If the word had a mistake more than 20 seconds ago and less than 10 minutes ago, show it first
            "Memory"."dateTimeLastMistake" IS NOT NULL
            AND "Memory"."dateTimeLastMistake" < NOW() - INTERVAL '20 seconds'
            AND "Memory"."dateTimeLastMistake" > NOW() - INTERVAL '10 minutes'
            AND (
              "Memory"."dateTimeRepeated" IS NULL
              OR "Memory"."dateTimeLastMistake" > "Memory"."dateTimeRepeated"
            )
          THEN 1
          ELSE 2
        END ASC,
        CASE
          -- If the word has already been learned before, order by next planned date, otherwise treat it as if it is planned for today
          WHEN "Memory"."dateTimePlanned" IS NOT NULL
            AND "Memory"."dateTimeRepeated" IS NOT NULL
          THEN "Memory"."dateTimePlanned"
          ELSE NOW() + INTERVAL '1 day'
        END ASC,
        "Snippet"."order" ASC
      LIMIT 1;
    `
  } catch (error) {
    const publicErrorMessage = 'Failed to get next flashcard'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  const nextMemory = memories?.[0]
  if (!nextMemory) {
    return NextResponse.json(
      {
        data: null,
        learnedPercentage: null,
      },
      { status: 200 }
    )
  }

  if (!nextMemory.snippetId || !nextMemory.snippetContent) {
    const publicErrorMessage = 'Snippet not found'
    console.error(publicErrorMessage)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  let memoryId = nextMemory.memoryId
  if (!memoryId) {
    try {
      const newMemory = await prisma.memory.create({
        data: {
          snippetId: nextMemory.snippetId,
          userId: user.db.id,
          openaiChat: [],
          interval: algorithmDefaults.interval,
          repetition: algorithmDefaults.repetition,
          eFactor: algorithmDefaults.eFactor,
          dateTimePlanned: DateTime.utc().toISO(),
        },
      })
      memoryId = newMemory.id
    } catch (error) {
      const publicErrorMessage = 'Error creating memory'
      logError(publicErrorMessage, error)
      return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
    }
  }

  return NextResponse.json(
    {
      data: {
        memoryId,
        memoryChat: nextMemory?.memoryChat ?? [],
        snippetId: nextMemory?.snippetId,
        snippetHeading: nextMemory?.snippetHeading,
        snippetContent: nextMemory?.snippetContent,
        snippetTask: nextMemory?.snippetTask,
      },
      learnedPercentage: null, //TODO
    },
    { status: 200 }
  )
}

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

  const { snippetId, numberOfMistakes } = body.data

  let foundMemory: Prisma.MemoryGetPayload<{ include: { snippet: true; user: true } }> | null = null
  try {
    foundMemory = await prisma.memory.findFirst({
      where: {
        snippetId,
        user: { id: user.db.id },
      },
      include: {
        snippet: true,
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
    snippetId,
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

  // Check if user has earned a new badge
  let newBadgeEarned = false
  if (numberOfMistakes === 0) {
    try {
      const { totalBadgeLevels } = await getBadges()
      if (totalBadgeLevels > user.db.totalBadgeLevels) {
        newBadgeEarned = true
        await prisma.user.update({
          where: {
            id: user.db.id,
          },
          data: {
            totalBadgeLevels,
          },
        })
      }
    } catch (error) {
      const publicErrorMessage = 'Error checking for new badge'
      logError(publicErrorMessage, error)
      return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/lesson')
  revalidatePath('/articles')
  revalidatePath('/api/memories')

  return NextResponse.json({ newItemLearned, newBadgeEarned }, { status: 200 })
}
