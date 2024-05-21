'use server'

import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Heading from '@/components/Heading'
import ButtonSignOut from '@/components/ButtonSignOut'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import { prisma } from '@/lib/prisma'
import Snippet from '@/components/Snippet'
import { categories } from '@/lib/config/content'

export default async function Profile() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/')
  }

  const overdueMemories = await prisma.memory.findMany({
    where: {
      userId: user.db.id,
      isLearned: false,
      dateTimePlanned: {
        lt: DateTime.now().toJSDate(),
      },
    },
    orderBy: [{ dateTimePlanned: 'asc' }],
  })

  const overdueMemoriesInDecks = overdueMemories.reduce(
    (acc, memory) => {
      const allDecks = categories.flatMap((category) => category.decks)
      const deck = allDecks.find((deck) => deck.slug === memory.deckSlug)
      if (!deck) {
        return acc
      }

      const existingDeck = acc.find((d) => d.slug === deck.slug)
      if (existingDeck) {
        existingDeck.memories.push({
          id: memory.id,
          deckSlug: memory.deckSlug,
          snippetSlug: memory.snippetSlug,
        })
      } else {
        acc.push({
          slug: deck.slug,
          title: deck.title,
          memories: [
            {
              id: memory.id,
              deckSlug: memory.deckSlug,
              snippetSlug: memory.snippetSlug,
            },
          ],
        })
      }

      return acc
    },
    [] as { slug: string; title: string; memories: { id: string; deckSlug: string; snippetSlug: string }[] }[]
  )

  return (
    <>
      <Heading heading="Overdue Memories" className="mb-0">
        <div className="flex gap-3">
          {user.db.role === 'ADMIN' && (
            <Button type={ButtonType.Link} variant={ButtonVariant.Primary} href="/admin">
              Admin
            </Button>
          )}
          <ButtonSignOut signOutText="Sign Out" />
        </div>
      </Heading>

      {overdueMemoriesInDecks.length === 0 ? (
        <p className="text-gray-500">No overdue memories</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {overdueMemoriesInDecks.map((deck) => (
            <div key={deck.slug}>
              <hr className="pb-8" />
              <Heading heading={deck.title} />
              {deck.memories.map((memory) => (
                <Snippet key={memory.id} deckSlug={memory.deckSlug} snippetSlug={memory.snippetSlug} />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
