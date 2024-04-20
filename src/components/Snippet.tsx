import { redirect } from 'next/navigation'
import { Drill } from 'lucide-react'
import { DateTime } from 'luxon'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import SRButtons from '@/components/SRButtons'
import ModalLogin from '@/components/ModalLogin'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'

export type SnippetType = {
  id: string
  heading: string
  content: string
  dateTimePlanned: Date
  isLearned: boolean
  showPlannedDate: boolean
}

export type SnippetProps = {
  snippet: SnippetType
}

export default async function Snippet({ snippet }: SnippetProps) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/')
  }

  return (
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
            dateTimePlanned={snippet.dateTimePlanned ? DateTime.fromJSDate(snippet.dateTimePlanned).toISO() : null}
            defaultIsLearned={snippet.isLearned}
            showPlannedDate={snippet.showPlannedDate}
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
  )
}
