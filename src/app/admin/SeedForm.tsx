'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Loader2, ShieldAlert } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import { updateSnippets } from './actions'
import Alert, { AlertVariant } from '@/components/Alert'

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
      Danger: Update/Reset decks and snippets from JSON
    </Button>
  )
}

export default function SeedForm() {
  const handleFormAction = (_prevState: any, formData: FormData) => {
    return updateSnippets(formData)
  }
  const [state, formAction] = useFormState(handleFormAction, initialState)

  return (
    <form action={formAction}>
      {state.message && <Alert variant={state.ok ? AlertVariant.Green : AlertVariant.Red} message={state.message} />}
      <div className="mb-3 flex items-center gap-1">
        <input type="checkbox" name="reset" id="reset" /> Reset altogether?
      </div>
      <SubmitButton />
    </form>
  )
}
