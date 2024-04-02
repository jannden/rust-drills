'use server'

import React from 'react'
import { redirect } from 'next/navigation'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'

import { prisma } from '@/lib/prisma'
import Alert, { AlertVariant } from '@/components/Alert'
import { Role } from '@prisma/client'
import { updateSnippet } from './actions'
import Form from './Form'
import Heading from '@/components/Heading'

type Props = {
  params: {
    snippetId: string
  }
}

export default async function LessonPage({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user || user.db.role !== Role.ADMIN) {
    redirect(`/sign-up`)
  }

  const snippet = await prisma.snippet.findUnique({
    where: {
      id: params.snippetId,
    },
    include: {
      deck: true,
    },
  })

  if (!snippet) {
    return <Alert message="Snippet not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading heading={snippet.heading} description={snippet.deck.subtitle} />
      <Form snippet={snippet} />
    </>
  )
}
