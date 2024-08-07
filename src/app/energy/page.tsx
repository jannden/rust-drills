'use server'

import Alert, { AlertVariant } from '@/components/Alert'
import Heading from '@/components/Heading'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { DateTime } from 'luxon'
import { redirect } from 'next/navigation'
import { defaultAI } from '@/lib/config/ai'
import { prisma } from '@/lib/prisma'
import { calculateTotalTokens } from '@/lib/utils'
import { categories } from '@/lib/config/content'
import { getAllDecks } from '@/lib/server/getBySlugs'

export default async function EnergyPage() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/sign-up')
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      userId: user.db.id,
      createdAt: {
        gte: DateTime.now().minus({ days: 1 }).toJSDate(),
      },
      OR: [{ completionTokens: { gt: 0 } }, { promptTokens: { gt: 0 } }],
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      memory: true,
    },
  })

  const enhancedPrompts = prompts.map((p) => {
    const allDecks = getAllDecks()
    const deckTitle = allDecks.find((deck) => deck.slug === p.memory?.deckSlug)?.title ?? ''
    const allSnippetsWithDeckSlug = allDecks.flatMap((deck) =>
      deck.snippets.map((snippet) => ({ heading: snippet.heading, snippetSlug: snippet.slug, deckSlug: deck.slug }))
    )
    const snippetHeading =
      allSnippetsWithDeckSlug.find(
        (snippet) => snippet.deckSlug === p.memory?.deckSlug && snippet.snippetSlug === p.memory?.snippetSlug
      )?.heading ?? ''

    return {
      ...p,
      memory: {
        ...p.memory,
        deckTitle,
        snippetHeading,
      },
    }
  })

  const dailyLimit = user.db.role === 'ADMIN' ? defaultAI.adminEnergy : defaultAI.dailyEnergy
  const totalSpent = prompts.reduce((acc, p) => acc + calculateTotalTokens(p), 0)
  const energy = dailyLimit - totalSpent

  return (
    <>
      <Heading
        heading="OpenAI API Tokens"
        description={`Practicing snippets with ChatGPT consumes tokens. You have a daily limit of ${dailyLimit} tokens.`}
        className="mb-6 border-b-0 pb-0"
      ></Heading>
      {prompts.length === 0 ? (
        <Alert variant={AlertVariant.Yellow} message="No energy spent recently." />
      ) : (
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Deck
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ">
                Snippet
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Energy
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {enhancedPrompts.map((prompt) => (
              <tr key={prompt.id}>
                <td className="hidden px-3 text-sm text-gray-500 lg:table-cell">{prompt.memory?.deckTitle}</td>
                <td className="w-full px-3 text-sm font-medium text-gray-900">
                  {prompt.memory?.snippetHeading}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Name</dt>
                    <dd className="mt-1 truncate text-gray-700">{prompt.memory?.deckTitle}</dd>
                    <dt className="sr-only sm:hidden">Date</dt>
                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                      {DateTime.fromJSDate(prompt.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {DateTime.fromJSDate(prompt.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
                </td>
                <td className="px-3 py-4 text-right text-sm text-gray-500">{calculateTotalTokens(prompt)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="hidden sm:table-cell" />
              <th className="hidden lg:table-cell" />
              <th
                scope="row"
                className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
              >
                Total spent
              </th>
              <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                Total spent
              </th>
              <td className="px-3 pt-6 text-right text-sm text-gray-500">{totalSpent}</td>
            </tr>
            <tr>
              <th className="hidden sm:table-cell" />
              <th className="hidden lg:table-cell" />
              <th
                scope="row"
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
              >
                Daily limit
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                Daily limit
              </th>
              <td className="px-3 pt-4 text-right text-sm text-gray-500">{dailyLimit}</td>
            </tr>
            <tr>
              <th className="hidden sm:table-cell" />
              <th className="hidden lg:table-cell" />
              <th
                scope="row"
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
              >
                Energy left
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                Energy left
              </th>
              <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-900">{energy}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </>
  )
}
