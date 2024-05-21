'use server'

import React from 'react'
import Alert, { AlertVariant } from '@/components/Alert'
import Heading from '@/components/Heading'
import Snippet from '@/components/Snippet'
import { categories } from '@/lib/config/content'

type Props = {
  params: {
    slug: string
  }
}

export default async function Deck({ params }: Props) {
const deck = categories
  .flatMap((category) => category.decks.map((deck) => ({ ...deck, categorySlug: category.slug })))
  .find((deck) => deck.slug === params.slug)

if (!deck) {
  return <Alert message="Deck not found." variant={AlertVariant.Red} />
}

  return (
    <>
      <Heading
        heading={`${deck.title}: ${deck.title}`}
        description={deck.subtitle}
        back={`/categories/${deck.categorySlug}`}
      />

      {deck.snippets.map((snippet) => (
        <Snippet key={`${deck.slug}/${snippet.slug}`} deckSlug={deck.slug} snippetSlug={snippet.slug} />
      ))}
    </>
  )
}
