'use server'

import React from 'react'
import { redirect } from 'next/navigation'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'

import Blackboard from '@/components/user/Blackboard'
import { prisma } from '@/lib/prisma'
import Alert, { AlertVariant } from '@/components/user/Alert'
import { Role } from '@prisma/client'
import { algorithmDefaults } from '@/lib/config/global'
import { DateTime } from 'luxon'

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
      article: true,
    },
  })

  if (!snippet) {
    return <Alert message="Snippet not found." variant={AlertVariant.Red} />
  }

  let memoryId = snippet.memories[0]?.id
  if (!memoryId) {
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
  }

  return (
    <Blackboard
      articleId={snippet.article.id}
      articleTitle={snippet.article.title}
      isAdmin={user.db.role === Role.ADMIN}
      memoryPreview={{
        snippetId: snippet.id,
        memoryId: memoryId,
        memoryChat: [],
        snippetHeading: snippet.heading,
        snippetContent: snippet.content,
        snippetTask: snippet.task,
      }}
    />
  )
}
