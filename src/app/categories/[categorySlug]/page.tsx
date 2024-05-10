'use server'

import ListOfDecks from '@/components/ListOfDecks'
import Heading from '@/components/Heading'
import { categories } from '@/lib/config/content'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    categorySlug?: string
  }
}

const DefaultCategory = 'fun-guides'

export default async function Decks({ params: { categorySlug: activeSlug = DefaultCategory } }: Props) {
  const category = categories.find(({ slug }) => slug === activeSlug)

  if (!category) {
    return notFound()
  }

  return (
    <>
      <Heading heading={category.title} back="/" />
      <ListOfDecks decks={category.decks} />
    </>
  )
}
