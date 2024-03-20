'use client'

import { useRef, useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Loader2, Zap } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/user/Button'
import TextareaAutosize from 'react-textarea-autosize'
import { sendMessage } from './actions'
import { useCtrlEnterSubmit } from '@/lib/hooks/use-enter-submit'
import Alert, { AlertVariant } from '@/components/user/Alert'

interface StoryFormProps {
  memoryId: string
}

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
      {pending ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5" aria-hidden="true" />}
      Submit
    </Button>
  )
}

function TextArea({
  message,
  handleMessageChange,
  onKeyDown,
}: {
  message: string
  handleMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const { pending } = useFormStatus()

  useEffect(() => {
    if (!pending && textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [pending])

  return (
    <TextareaAutosize
      onKeyDown={onKeyDown}
      ref={textAreaRef}
      disabled={pending}
      minRows={2}
      cacheMeasurements
      autoFocus
      onChange={handleMessageChange}
      value={message}
      name="comment"
      id="comment"
      className="mb-6 block w-full rounded-lg py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-600 disabled:cursor-wait disabled:bg-gray-50 sm:text-sm sm:leading-6"
    />
  )
}

export default function DialogueForm({ memoryId }: StoryFormProps) {
  const { formRef, onKeyDown } = useCtrlEnterSubmit()
  const [message, setMessage] = useState('')

  const handleFormAction = (prevState: any, formData: FormData) => {
    setMessage('')
    return sendMessage(prevState, formData)
  }

  const [state, formAction] = useFormState(handleFormAction, initialState)

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  useEffect(() => {
    if (state.ok) {
      setMessage('')
    }
  }, [state])

  return (
    <>
      {state.message && <Alert variant={AlertVariant.Yellow} message={state.message} />}

      <form action={formAction} className="w-full" ref={formRef}>
        <input type="hidden" name="memoryId" value={memoryId} />
        <TextArea message={message} handleMessageChange={handleMessageChange} onKeyDown={onKeyDown} />
        <SubmitButton />
      </form>
    </>
  )
}
