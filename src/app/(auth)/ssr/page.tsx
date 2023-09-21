'use server'

import { currentUser, auth } from '@clerk/nextjs'
import type { User } from '@clerk/nextjs/api'

export default async function Page() {
  const user: User | null = await currentUser()

  console.log('user', user)

  const authUser = auth()

  console.log('authUser', authUser)

  return (
    <div>
      Hello, {user?.firstName} your current active session is {user?.id}
    </div>
  )
}
