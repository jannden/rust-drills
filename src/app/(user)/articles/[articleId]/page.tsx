'use server'

import React from 'react'
import Alert, { AlertVariant } from '@/components/user/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/user/Button'
import Heading from '@/components/user/Heading'
import { prisma } from '@/lib/prisma'

type Props = {
  params: {
    articleId: string
  }
}

export default async function Article({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: {
      id: params.articleId,
    },
  })
  if (!article) {
    return <Alert message="Article not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading heading={article.title} />
      <div className="mb-6">{article.summary}</div>
      <div className="flex gap-3">
      <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/lesson/${article.id}`}>
        Practice
      </Button>
      <Button variant={ButtonVariant.Secondary} type={ButtonType.Link} href={article.url} target="_blank">
        Read Article
      </Button></div>
    </>
  )
}
