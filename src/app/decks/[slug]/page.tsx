'use server'

import React from 'react'
import Alert, { AlertVariant } from '@/components/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import Heading from '@/components/Heading'
import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Prisma } from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { ResolvingMetadata, Metadata } from 'next'
import { Drill } from 'lucide-react'
import ModalLogin from '@/components/ModalLogin'
import SRButtons from './SRButtons'
import { DateTime } from 'luxon'

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const deck = await prisma.deck.findUnique({
    where: {
      slug: params.slug,
    },
  })

  return {
    alternates: {
      canonical: deck?.canonicalUrl,
    },
  }
}

export default async function Deck({ params }: Props) {
  const user = await getClerkWithDb()

  let includeMemory: Prisma.SnippetInclude = {}
  if (user) {
    includeMemory = { memories: { where: { user: { id: user.db.id } } } }
  }

  const deck = await prisma.deck.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      snippets: {
        orderBy: {
          order: 'asc',
        },
        include: includeMemory,
      },
    },
  })

  if (!deck) {
    return <Alert message="Deck not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading heading={deck.title} description={deck.subtitle} back={`/categories/${deck.categorySlug}`} />

      {deck.snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="mb-12 border-b border-stone-200 pb-12 transition last:border-0 sm:rounded-lg sm:border sm:p-6 sm:shadow last:sm:border hover:sm:shadow-lg"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row" id={snippet.id}>
            <div>
              <h3 className="pb-6 text-xl">{snippet.heading}</h3>
              <ReactMarkdown className="prose" rehypePlugins={[rehypeHighlight]}>
                {snippet.content}
              </ReactMarkdown>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-between gap-6 lg:w-28 lg:flex-col">
              <SRButtons
                snippetId={snippet.id}
                dateTimePlanned={
                  snippet.memories?.[0]?.dateTimePlanned
                    ? DateTime.fromJSDate(snippet.memories?.[0]?.dateTimePlanned).toISO()
                    : null
                }
              />
              {user ? (
                <Button
                  variant={ButtonVariant.Primary}
                  type={ButtonType.Link}
                  href={`/snippets/${snippet.id}/drill`}
                  className="group flex items-center justify-center gap-1"
                >
                  <Drill className="size-4 transition-transform group-hover:rotate-45" />
                  Drill
                </Button>
              ) : (
                <ModalLogin>
                  <div className="group flex items-center justify-center gap-1">
                    <Drill className="size-4 transition-transform group-hover:rotate-45" />
                    Drill
                  </div>
                </ModalLogin>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
