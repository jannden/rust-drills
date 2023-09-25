'use client'

import { useRef, useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Loader2, Zap } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/user/Button'
import TextareaAutosize from 'react-textarea-autosize'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { ChatRequestOptions } from 'ai'

interface StoryFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void
  isLoadingContent: boolean
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

function TextArea({
  message,
  handleMessageChange,
  onKeyDown,
  disabled,
}: {
  message: string
  handleMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
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
      disabled={pending || disabled}
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

export default function DialogueForm({ handleSubmit, isLoadingContent, input, handleInputChange }: StoryFormProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  return (
    <>
      <form onSubmit={handleSubmit} className="w-full" ref={formRef}>
        <TextArea
          message={input}
          handleMessageChange={handleInputChange}
          onKeyDown={onKeyDown}
          disabled={isLoadingContent}
        />
        <Button
          variant={ButtonVariant.Primary}
          type={ButtonType.Submit}
          disabled={isLoadingContent}
          className="flex items-center gap-3"
        >
          {isLoadingContent ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Zap className="size-5" aria-hidden="true" />
          )}
          Send
        </Button>
      </form>
    </>
  )
}
