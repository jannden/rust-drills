'use client'
import { useAuth, useUser } from '@clerk/nextjs'

export default function Example() {
  const auth = useAuth()
  const { isLoaded: isAuthLoaded, userId, sessionId, getToken } = auth
  console.log('auth', auth)

  const { isLoaded, isSignedIn, user } = useUser()
  console.log('user', user)
  if (!isLoaded || !isSignedIn) {
    return null
  }

  return <div>Hello, {user.firstName} welcome to Clerk</div>
}
