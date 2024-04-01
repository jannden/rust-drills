'use client'

import { useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Loader2, ShieldAlert } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import TextareaAutosize from 'react-textarea-autosize'
import { updateSnippet } from './actions'
import Alert, { AlertVariant } from '@/components/Alert'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { Prisma } from '@prisma/client'

const initialState = {
  message: '',
  ok: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      variant={ButtonVariant.Primary}
      type={ButtonType.Submit}
      disabled={pending}
      className="flex items-center gap-3"
    >
      {pending ? <Loader2 className="size-5 animate-spin" /> : <ShieldAlert className="size-5" aria-hidden="true" />}
      Save
    </Button>
  )
}

function TextArea({
  name,
  message,
  handleMessageChange,
}: {
  name: string
  message: string
  handleMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const { pending } = useFormStatus()

  return (
    <TextareaAutosize
      id={name}
      name={name}
      ref={textAreaRef}
      disabled={pending}
      minRows={2}
      onChange={handleMessageChange}
      value={message}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  )
}

export default function Form({
  snippet,
}: {
  snippet: Prisma.SnippetGetPayload<{
    include: { article: true }
  }>
}) {
  const [content, setContent] = useState(snippet.content)
  const [task, setTask] = useState(snippet.task)

  const handleFormAction = (_prevState: any, formData: FormData) => {
    return updateSnippet(formData)
  }

  const [state, formAction] = useFormState(handleFormAction, initialState)

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  const handleTaskChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask(event.target.value)
  }

  return (
    <form action={formAction}>
      {state.message && <Alert variant={state.ok ? AlertVariant.Green : AlertVariant.Red} message={state.message} />}

      <input type="hidden" name="snippetId" value={snippet.id} />
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <label htmlFor="heading" className="mb-3 block text-xl">
            Heading
          </label>
          <input
            type="text"
            name="heading"
            id="heading"
            defaultValue={snippet.heading}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="col-span-full">
          <label htmlFor="content" className="mb-3 block text-xl">
            Content
          </label>
          <TextArea name="content" message={content} handleMessageChange={handleContentChange} />
          <ReactMarkdown className="prose max-w-full bg-slate-50 p-6" rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
        <div className="col-span-full">
          <label htmlFor="task" className="mb-3 block text-xl">
            Task
          </label>
          <TextArea name="task" message={task} handleMessageChange={handleTaskChange} />
          <ReactMarkdown className="prose max-w-full bg-slate-50 p-6" rehypePlugins={[rehypeHighlight]}>
            {task}
          </ReactMarkdown>
        </div>
      </div>

      {state.message && (
        <Alert variant={state.ok ? AlertVariant.Green : AlertVariant.Red} message={state.message} className="mt-6" />
      )}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <SubmitButton />
        <Button variant={ButtonVariant.Secondary} type={ButtonType.Link} href={`/articles/${snippet.article.id}`}>
          Back to all snippets
        </Button>
      </div>
    </form>
  )
}
