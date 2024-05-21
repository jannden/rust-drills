'use server'

import React from 'react'
import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { prisma } from '@/lib/prisma'
import { algorithmDefaults } from '@/lib/config/sr'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Alert, { AlertVariant } from '@/components/Alert'
import { getSnippetBySlugs } from '@/lib/server/getBySlugs'
import { Memory } from '@prisma/client'

type Props = {
  params: {
    deckSlug: string
    snippetSlug: string
  }
}

export default async function DrillingSnippet({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const snippet = await getSnippetBySlugs(params.deckSlug, params.snippetSlug)
  if (!snippet) {
    return <Alert message="Snippet not found." variant={AlertVariant.Red} />
  }

  let memory: Memory | null = null
  if (user) {
    memory = await prisma.memory.findFirst({
      where: {
        userId: user.db.id,
        snippetSlug: snippet.snippetSlug,
        deckSlug: snippet.deckSlug,
      },
    })
  }

  if (memory) {
    redirect(`/drills/${memory?.id}/stream`)
  }

  try {
    const newMemory = await prisma.memory.create({
      data: {
        snippetSlug: snippet.snippetSlug,
        deckSlug: snippet.deckSlug,
        userId: user.db.id,
        openaiChat: [],
        interval: algorithmDefaults.interval,
        repetition: algorithmDefaults.repetition,
        eFactor: algorithmDefaults.eFactor,
        dateTimePlanned: DateTime.utc().toISO(),
      },
    })
    redirect(`/drills/${newMemory.id}/stream`)
  } catch (e) {
    console.error(e)
    return <Alert message="Error creating memory." variant={AlertVariant.Red} />
  }
}
