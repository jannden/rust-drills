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
    articleId: string
  }
}

export default async function LessonPage({ params }: Props) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const article = await prisma.article.findUnique({
    where: {
      id: params.articleId,
    },
  })

  if (!article) {
    return <Alert message="Article not found." variant={AlertVariant.Red} />
  }

  return (
    <Blackboard
      articleId={article.id}
      articleTitle={article.title}
      isAdmin={user.db.role === Role.ADMIN}
      memoryPreview={null}
    />
  )
}