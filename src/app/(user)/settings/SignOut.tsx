'use client'

import { useRouter } from 'next/navigation'
import Button, { ButtonType, ButtonVariant } from '@/components/user/Button'
import { useClerk } from '@clerk/nextjs'

export default function SignOut({ signOutText }: { signOutText: string }) {
  const router = useRouter()
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    signOut(() => router.push('/'))
  }

  return (
    <Button variant={ButtonVariant.Soft} type={ButtonType.Button} onClick={handleSignOut}>
      {signOutText}
    </Button>
  )
}
