'use server'

import React from 'react'
import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { prisma } from '@/lib/prisma'
import { algorithmDefaults } from '@/lib/config/sr'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Alert, { AlertVariant } from '@/components/Alert'

type Props = {
  params: {
    snippetId: string
  }
}

export default async function LessonPage({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const snippet = await prisma.snippet.findUnique({
    where: {
      id: params.snippetId,
    },
    include: {
      memories: {
        where: {
          userId: user.db.id,
        },
      },
      deck: true,
    },
  })

  if (!snippet) {
    return <Alert message="Snippet not found." variant={AlertVariant.Red} />
  }

  let memoryId = snippet.memories[0]?.id

  if (memoryId) {
    redirect(`/drills/${memoryId}/stream`)
  }

  const newMemory = await prisma.memory.create({
    data: {
      snippetId: snippet.id,
      userId: user.db.id,
      openaiChat: [],
      interval: algorithmDefaults.interval,
      repetition: algorithmDefaults.repetition,
      eFactor: algorithmDefaults.eFactor,
      dateTimePlanned: DateTime.utc().toISO(),
    },
  })
  memoryId = newMemory.id

  redirect(`/drills/${memoryId}/stream`)
}
