'use server'

import React from 'react'
import Alert, { AlertVariant } from '@/components/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import Heading from '@/components/Heading'
import { prisma } from '@/lib/prisma'
import ItemCard from '@/components/ItemCard'

type Props = {
  params: {
    slug: string
  }
}

export default async function Deck({ params }: Props) {
  const deck = await prisma.deck.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      snippets: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  })
  if (!deck) {
    return <Alert message="Deck not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading heading={deck.title}>
        <div className="flex gap-3">
          <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/lesson/${deck.id}`}>
            Practice
          </Button>
        </div>
      </Heading>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {deck.snippets.map((s) => (
          <ItemCard
            key={s.id}
            cardDetails={{
              deckId: deck.id,
              deckTitle: deck.title,
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
