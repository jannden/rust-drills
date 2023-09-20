import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs'
import { currentUser, auth, User } from '@clerk/nextjs/server'

export async function GET() {
  const user: User | null = await currentUser()

  console.log('user', user)

  const authUser = auth()

  console.log('authUser', authUser)

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const getUser = user?.id ? await clerkClient.users.getUser(user?.id) : null

  console.log('getUser', getUser)

  return NextResponse.json(
    {
      user: getUser,
    },
    { status: 200 }
  )
}
