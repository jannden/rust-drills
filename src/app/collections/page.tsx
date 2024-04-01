'use server'

import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { prisma } from '@/lib/prisma'
import { calculateMemoryStrength } from '@/lib/utils'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { CardDetails } from '@/lib/types'

import Heading from '@/components/Heading'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import ItemCard from '@/components/ItemCard'
import Alert, { AlertVariant } from '@/components/Alert'

export default async function CollectionsPage() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  //TODO
  const paginationItemsPerPage = 100
  const paginationPage = 1

  const memories = await prisma.memory.findMany({
    where: {
      userId: user.db.id,
      NOT: { dateTimeRepeated: null },
    },
    orderBy: { dateTimePlanned: 'asc' },
    include: {
      snippet: {
        include: {
          article: true,
        },
      },
    },
    skip: paginationItemsPerPage * (Number(paginationPage) - 1),
    take: paginationItemsPerPage,
  })

  const parsedMemories: CardDetails[] = memories.map((m) => ({
    articleId: m.snippet.article.id,
    articleTitle: m.snippet.article.title,
    snippetId: m.snippet.id,
    snippetHeading: m.snippet.heading,
    memoryId: m.id,
    memoryStrength: calculateMemoryStrength(m.dateTimePlanned.toISOString()),
    dateTimePlanned: m.dateTimePlanned,
  }))

  const hasWordsToRepeat =
    parsedMemories.filter(
      (m) => m.dateTimePlanned && DateTime.fromISO(m.dateTimePlanned.toISOString()).diffNow('days').as('days') < 1
    ).length > 0

  return (
    <>
      <Heading heading={'Collection of snippets'} className="mb-6 border-0 pb-0">
        {hasWordsToRepeat && (
          <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href="lesson">
            Repeat
          </Button>
        )}
      </Heading>

      {!parsedMemories?.length ? (
        <div className="mb-12">
          <Alert variant={AlertVariant.Blue} message="No snippets yet. Add some by exploring the articles." />
          <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href="/articles">
            New Snippets
          </Button>
        </div>
      ) : null}

      {parsedMemories?.length && !hasWordsToRepeat ? (
        <div className="mb-12">
          <Alert variant={AlertVariant.Blue} message={`Nothing to repeat. Learn new snippets.`} />
          <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href="/articles">
            New Snippets
          </Button>
        </div>
      ) : null}

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {parsedMemories.map((m) => (
          <ItemCard key={m.memoryId} cardDetails={m} />
        ))}
      </ul>
    </>
  )
}
