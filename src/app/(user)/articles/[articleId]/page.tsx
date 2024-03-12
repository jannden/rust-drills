'use server'

import React from 'react'
import Alert, { AlertVariant } from '@/components/user/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/user/Button'
import Heading from '@/components/user/Heading'
import { prisma } from '@/lib/prisma'
import ItemCard from '@/components/user/ItemCard'

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
    include: {
      snippets: true,
    },
  })
  if (!article) {
    return <Alert message="Article not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading heading={article.title}>
        <div className="flex gap-3">
          <Button variant={ButtonVariant.Secondary} type={ButtonType.Link} href={article.url} target="_blank">
            Read Article
          </Button>
          <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/lesson/${article.id}`}>
            Practice
          </Button>
        </div>
      </Heading>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {article.snippets.map((s) => (
          <ItemCard
            key={s.id}
            cardDetails={{
              articleId: article.id,
              articleTitle: article.title,
              snippetId: s.id,
              snippetHeading: s.heading,
              memoryId: null,
              memoryStrength: null,
              dateTimePlanned: null,
            }}
          />
        ))}
      </ul>
    </>
  )
}
