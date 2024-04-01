'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Loader2, ShieldAlert } from 'lucide-react'

import Button, { ButtonType, ButtonVariant } from '@/components/Button'
import { toggleAdmin, updateSnippet } from './actions'
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
      Toggle Admin
    </Button>
  )
}

export default function ToggleAdminForm({ isAdmin }: { isAdmin: boolean }) {
  const handleFormAction = (_prevState: any, formData: FormData) => {
    return toggleAdmin()
  }
  const [state, formAction] = useFormState(handleFormAction, initialState)

  return (
    <form action={formAction}>
      {state.message && <Alert variant={state.ok ? AlertVariant.Green : AlertVariant.Red} message={state.message} />}
      {`Admin status: ${isAdmin}`}
      <SubmitButton />
    </form>
  )
}
