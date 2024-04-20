'use server'

import React from 'react'
import Alert, { AlertVariant } from '@/components/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import Heading from '@/components/Heading'
import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Prisma } from '@prisma/client'
import { ResolvingMetadata, Metadata } from 'next'
import Snippet from '@/components/Snippet'

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const deck = await prisma.deck.findUnique({
    where: {
      slug: params.slug,
    },
  })

  return {
    alternates: {
      canonical: deck?.canonicalUrl,
    },
  }
}

export default async function Deck({ params }: Props) {
  const user = await getClerkWithDb()

  let includeMemory: Prisma.SnippetInclude = {}
  if (user) {
    includeMemory = { memories: { where: { user: { id: user.db.id } } } }
  }

  const deck = await prisma.deck.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      snippets: {
        orderBy: {
          order: 'asc',
        },
        include: includeMemory,
      },
    },
  })

  if (!deck) {
    return <Alert message="Deck not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading
        heading={`${deck.categoryTitle}: ${deck.title}`}
        description={deck.subtitle}
        back={`/categories/${deck.categorySlug}`}
      />

      {deck.snippets.map((snippet) => (
        <Snippet
          key={snippet.id}
          snippet={{
            id: snippet.id,
            heading: snippet.heading,
            content: snippet.content,
            dateTimePlanned: snippet.memories[0]?.dateTimePlanned,
          }}
        />
      ))}
    </>
  )
}
