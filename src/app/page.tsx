'use server'

import Image from 'next/image'
import { Prisma, Role } from '@prisma/client'
import { DateTime } from 'luxon'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'
import Heading from '@/components/Heading'
import { deckLocalImages } from '@/lib/config/decks'

export default async function Decks() {
  const user = await getClerkWithDb()

  let whereArg: Prisma.DeckWhereInput = {}
  if (user?.db.role !== Role.ADMIN) {
    whereArg = { isVisible: true }
  }

  const decks = await prisma.deck.findMany({
    where: whereArg,
    orderBy: { order: 'asc' },
  })

  // TODO: This is a workaround for Next.js to optimize local images (can't load the url from DB to use SSR)
  const enrichedDecks = deckLocalImages.map((localImage, index) => {
    const deckData = decks.find((d) => d.order === index + 1)
    if (!deckData) {
      return null
    }
    return {
      ...deckData,
      imageUrl: localImage,
    }
  })

  return (
    <>
      <Heading heading="Decks" />
      <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:mx-0 lg:grid-cols-3 xl:grid-cols-4">
        {enrichedDecks.map(
          (deck) =>
            deck && (
              <article key={deck.id} className="group relative flex flex-col items-start justify-between">
                <div className="xs:aspect-[32/9] relative aspect-[16/9] w-full sm:aspect-[16/9]">
                  <Image
                    src={deck.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="rounded-2xl object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 15vw"
                  />
                </div>
                <div className="mt-6 max-w-xl">
                  <a
                    href={`decks/${deck.slug}`}
                    className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600"
                  >
                    <span className="absolute inset-0" />
                    {deck.title}
                  </a>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{deck.subtitle}</p>
                </div>
              </article>
            )
        )}
      </div>
    </>
  )
}
