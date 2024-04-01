'use server'

import Link from 'next/link'
import { Bookmark, Check, ChevronRight } from 'lucide-react'
import { Prisma, Role } from '@prisma/client'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'
import Heading from '@/components/Heading'
import CircularProgress from '@/components/CircularProgress'

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

  // TODO: get user's progress for each deck
  const isLearned = true
  const progress = 50

  return (
    <>
      <Heading heading="Decks" />
      <ul role="list" className="divide-y divide-gray-100">
        {decks.map((a) => (
          <li key={a.id} className="group relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <div className="flex min-w-0 items-center justify-center gap-x-6">
              {isLearned ? (
                <Check className="size-6 text-indigo-600" aria-hidden="true" />
              ) : (
                <CircularProgress percent={progress}>
                  <Bookmark className={'size-3 flex-none text-indigo-600'} aria-hidden="true" />
                </CircularProgress>
              )}
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <Link href={`/decks/${a.id}`}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {a.title}
                  </Link>
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">{a.subtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-6">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{null}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{null}</p>
              </div>
              <div className="-mr-2 w-7">
                <ChevronRight
                  className="size-5 flex-none text-gray-400 transition group-hover:size-7 group-hover:text-indigo-600"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
