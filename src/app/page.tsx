'use server'

import { Prisma, Role } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { deckLocalImages } from '@/lib/config/decks'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import ListOfDecks from '@/components/ListOfDecks'
import ListOfCategories from '@/components/ListOfCategories'
import WelcomeMessage from '@/components/WelcomeMessage'

type Props = {
  params: {
    categorySlug?: string
  }
}

const DefaultCategory = 'fun-guides'

export default async function Decks({ params: { categorySlug: activeSlug = DefaultCategory } }: Props) {
  const user = await getClerkWithDb()

  let whereArg: Prisma.DeckWhereInput = {}
  if (user?.db.role !== Role.ADMIN) {
    whereArg = { isVisible: true }
  }

  const decks = await prisma.deck.findMany({
    where: whereArg,
    orderBy: { order: 'asc' },
  })

  const categories = decks.reduce(
    (acc, deck) => {
      if (deck.isVisible) {
        if (!acc.find(({ slug }) => slug === deck.categorySlug)) {
          acc.push({ slug: deck.categorySlug, title: deck.categoryTitle })
        }
      }
      return acc
    },
    [] as { slug: string; title: string }[]
  )

  // TODO: This is a workaround for Next.js to optimize local images (can't load the url from DB to use SSR)
  const enrichedDecks = deckLocalImages
    .map((localImage, index) => {
      const deckData = decks.find((d) => d.order === index + 1)
      if (!deckData) {
        return null
      }
      return {
        ...deckData,
        imageUrl: localImage,
      }
    })
    .filter((deck) => deck?.categorySlug === activeSlug)

  return (
    <>
      <WelcomeMessage />

      <ListOfCategories categories={categories} activeSlug={activeSlug} />

      <ListOfDecks decks={enrichedDecks} />
    </>
  )
}
