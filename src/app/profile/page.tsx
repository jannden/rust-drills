'use server'

import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import Heading from '@/components/Heading'
import ButtonSignOut from '@/components/ButtonSignOut'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import { prisma } from '@/lib/prisma'
import Snippet, { SnippetType } from '@/components/Snippet'

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
    include: {
      snippet: {
        include: {
          deck: true,
        },
      },
    },
    orderBy: [
      { dateTimePlanned: 'asc' },
      {
        snippet: {
          deckId: 'asc',
        },
      },
    ],
  })

  const overdueDecksWithSnippets = overdueMemories.reduce(
    (acc, memory) => {
      const deck = acc.find((deck) => deck.id === memory.snippet.deck.id)
      const tempSnip = {
        id: memory.snippet.id,
        heading: memory.snippet.heading,
        content: memory.snippet.content,
        dateTimePlanned: memory.dateTimePlanned,
        isLearned: memory.isLearned,
        showPlannedDate: true,
      }
      if (deck) {
        deck.snippets.push(tempSnip)
      } else {
        acc.push({
          id: memory.snippet.deck.id,
          title: memory.snippet.deck.title,
          snippets: [tempSnip],
        })
      }
      return acc
    },
    [] as { id: string; title: string; snippets: SnippetType[] }[]
  )

  return (
    <>
      <Heading heading="My Overdue Snippets" className="mb-0">
        <div className="flex gap-3">
          {user.db.role === 'ADMIN' && (
            <Button type={ButtonType.Link} variant={ButtonVariant.Primary} href="/admin">
              Admin
            </Button>
          )}
          <ButtonSignOut signOutText="Sign Out" />
        </div>
      </Heading>

      {overdueDecksWithSnippets.length === 0 ? (
        <p className="text-gray-500">No overdue snippets</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {overdueDecksWithSnippets.map((deck) => (
            <div key={deck.id}>
              <hr className="pb-8" />
              <Heading heading={deck.title} />
              {deck.snippets.map((snippet) => (
                <Snippet key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
