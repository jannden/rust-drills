'use client'

import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { Loader2 } from 'lucide-react'

import { FormState } from '@/lib/types'
import { isValidUrl } from '@/lib/utils'

import { AlertVariant } from '@/components/user/Alert'
import Alert from '@/components/user/Alert'
import Button, { ButtonType } from '@/components/user/Button'

import { openStripe } from './actions'

const initialState: FormState = {
  message: null,
  ok: null,
}

interface BillingFormProps {
  isPro: boolean
}

function SubmitButton({ isPro }: BillingFormProps) {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type={ButtonType.Button}>
      {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
      {isPro ? 'Manage Subscription' : 'Upgrade to PRO'}
    </Button>
  )
}

export function BillingForm({ isPro }: BillingFormProps) {
  const [formState, formAction] = useFormState(openStripe, initialState)

  useEffect(() => {
    if (formState.ok === true && isValidUrl(formState.message)) {
      // window.location.href = formState.message
    }
  }, [formState])

  return (
    <>
      {formState.ok === true && formState.message ? (
        <Alert
          variant={AlertVariant.Yellow}
          message={'Proceed to Stripe to manage your subscription.'}
          link={{ text: 'Open Stripe', href: formState.message }}
          isDismissible
        />
      ) : null}
      {formState.ok === false && formState?.message ? (
        <Alert variant={AlertVariant.Red} message={formState?.message} />
      ) : null}
      <form action={formAction}>
        <SubmitButton isPro={isPro} />
      </form>
    </>
  )
}
