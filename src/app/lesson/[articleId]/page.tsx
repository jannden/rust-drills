'use server'

import React from 'react'
import { redirect } from 'next/navigation'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'

import Blackboard from '@/components/Blackboard'
import { prisma } from '@/lib/prisma'
import Alert, { AlertVariant } from '@/components/Alert'
import { Role } from '@prisma/client'

type Props = {
  params: {
    deckId: string
  }
}

export default async function LessonPage({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const deck = await prisma.deck.findUnique({
    where: {
      id: params.deckId,
    },
  })

  if (!deck) {
    return <Alert message="Deck not found." variant={AlertVariant.Red} />
  }

  return (
    <Blackboard deckId={deck.id} deckTitle={deck.title} isAdmin={user.db.role === Role.ADMIN} memoryPreview={null} />
  )
}
