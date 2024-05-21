'use client'

import React, { useEffect, useRef, useState } from 'react'
import UIWCodeEditor from '@uiw/react-textarea-code-editor/nohighlight'
import { useFormStatus } from 'react-dom'
import rehypeHighlight from 'rehype-highlight'

import '@uiw/react-textarea-code-editor/dist.css'
import './code-editor.css'

export default function CodeEditor({
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
  const [localMessage, setLocalMessage] = useState(message)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const { pending } = useFormStatus()

  useEffect(() => {
    if (!pending && textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [pending])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalMessage(event.target.value)
    handleMessageChange(event)
  }

  return (
    <div>
      <UIWCodeEditor
        value={localMessage}
        disabled={disabled || pending}
        language="rust"
        placeholder="// Write Rust code here..."
        onChange={handleChange}
        onKeyDown={onKeyDown}
        rehypePlugins={[rehypeHighlight as any]}
        className="mb-6 w-full shadow-sm ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-orange-600 disabled:cursor-wait disabled:bg-gray-50"
        minHeight={80}
      />
    </div>
  )
}
