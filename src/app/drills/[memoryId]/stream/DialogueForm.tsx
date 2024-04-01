'use client'

import { FormEvent, ChangeEvent } from 'react'
import { Loader2, Zap } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import { useCtrlEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { ChatRequestOptions } from 'ai'
import CodeEditor from './CodeEditor'
import Energy from '@/components/Energy'

interface StoryFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void
  isLoadingContent: boolean
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function DialogueForm({ handleSubmit, isLoadingContent, input, handleInputChange }: StoryFormProps) {
  const { formRef, onKeyDown } = useCtrlEnterSubmit()

  return (
    <form onSubmit={handleSubmit} className="w-full" ref={formRef}>
      <CodeEditor
        message={input}
        handleMessageChange={handleInputChange}
        onKeyDown={onKeyDown}
        disabled={isLoadingContent}
      />
      <div className="flex justify-between">
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
          Submit
        </Button>
        <Energy energyTimestamp={Date.now()} />
      </div>
    </form>
  )
}
