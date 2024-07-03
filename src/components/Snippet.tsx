'use server'

import { Drill } from 'lucide-react'
import { DateTime } from 'luxon'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { ContentVariant } from '@/lib/types'
import SRButtons from '@/components/SRButtons'
import ModalLogin from '@/components/ModalLogin'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import { Memory } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSnippetBySlugs, loadMdx } from '@/lib/server/getBySlugs'
import Alert, { AlertVariant } from './Alert'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export type Props = {
  categorySlug: string
  deckSlug: string
  snippetSlug: string
}

export default async function Snippet({ categorySlug, deckSlug, snippetSlug }: Props) {
  const user = await getClerkWithDb()

  const snippet = await getSnippetBySlugs(deckSlug, snippetSlug)
  if (!snippet) {
    return <Alert message="Snippet not found." variant={AlertVariant.Red} />
  }

  let memory: Memory | null = null
  if (user) {
    memory = await prisma.memory.findFirst({
      where: {
        userId: user.db.id,
        deckSlug: deckSlug,
        snippetSlug: snippetSlug,
      },
    })
  }

  const content = await loadMdx(categorySlug, deckSlug, snippetSlug, ContentVariant.explanation)

  return (
    <div
      key={`${snippet.deckSlug}/${snippet.snippetSlug}`}
      className="mb-12 border-b border-stone-200 pb-12 transition last:border-0 sm:rounded-lg sm:border sm:p-6 sm:shadow last:sm:border hover:sm:shadow-lg"
    >
      <div className="flex flex-col justify-between gap-6 lg:flex-row" id={snippet.snippetSlug}>
        <div>
          <h3 className="pb-6 text-xl">{snippet.heading}</h3>
          <ReactMarkdown className="prose" rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-between gap-6 lg:w-28 lg:flex-col">
          <SRButtons
            categorySlug={categorySlug}
            deckSlug={snippet.deckSlug}
            snippetSlug={snippet.snippetSlug}
            dateTimePlanned={memory?.dateTimePlanned ? DateTime.fromJSDate(memory.dateTimePlanned).toISO() : null}
            defaultIsLearned={!!memory?.isLearned}
            showPlannedDate={true}
          />
          <SignedIn>
            <Button
              variant={ButtonVariant.Primary}
              type={ButtonType.Link}
              href={`/snippets/${snippet.deckSlug}/${snippet.snippetSlug}`}
              className="group flex items-center justify-center gap-1"
            >
              <Drill className="size-4 transition-transform group-hover:rotate-45" />
              Drill
            </Button>
          </SignedIn>
          <SignedOut>
            <ModalLogin>
              <div className="group flex items-center justify-center gap-1">
                <Drill className="size-4 transition-transform group-hover:rotate-45" />
                Drill
              </div>
            </ModalLogin>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
