'use server'

import React from 'react'
import { RedirectType, redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Alert, { AlertVariant } from '@/components/Alert'
import { getSnippetBySlugs } from '@/lib/server/getBySlugs'
import { Memory } from '@prisma/client'
import { revalidatePath } from 'next/cache'

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
    redirect(`/drills/${memory.id}`, RedirectType.replace)
  }

  let newMemory: Memory
  try {
    newMemory = await prisma.memory.create({
      data: {
        snippetSlug: snippet.snippetSlug,
        deckSlug: snippet.deckSlug,
        userId: user.db.id,
        openaiChat: [],
        interval: null,
        repetition: null,
        eFactor: null,
        dateTimePlanned: null,
      },
    })
    revalidatePath(`/snippets/${params.deckSlug}/${params.snippetSlug}`)
  } catch (e) {
    console.error(e)
    return <Alert message="Error creating memory." variant={AlertVariant.Red} />
  }
  redirect(`/drills/${newMemory.id}`, RedirectType.replace)
}
