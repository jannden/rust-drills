'use client'

import { FormEvent, ChangeEvent } from 'react'
import { Loader2, Zap } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/user/Button'
import { useShiftEnterSubmit } from '@/lib/hooks/use-shift-enter-submit'
import { ChatRequestOptions } from 'ai'
import CodeEditor from './CodeEditor'

interface StoryFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void
  isLoadingContent: boolean
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function DialogueForm({ handleSubmit, isLoadingContent, input, handleInputChange }: StoryFormProps) {
  const { formRef, onKeyDown } = useShiftEnterSubmit()
  return (
    <form onSubmit={handleSubmit} className="w-full" ref={formRef}>
      <CodeEditor
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
        {isLoadingContent ? <Loader2 className="size-5 animate-spin" /> : <Zap className="size-5" aria-hidden="true" />}
        Submit
      </Button>
    </form>
  )
}
