'use server'

import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function SignUp() {
  const userClerk = await currentUser()
  if (userClerk) {
    const userDb = await prisma.user.upsert({
      where: { clerkId: userClerk.id },
      update: {
        email: userClerk.emailAddresses[0].emailAddress,
        lastLogin: new Date(),
      },
      create: {
        clerkId: userClerk.id,
        firstName: userClerk.firstName,
        email: userClerk.emailAddresses[0].emailAddress,
      },
    })

    if (userDb.lastLogin) {
      // User has already logged in before
    }

    // New user
    // TODO: Send a welcome email to new users
  }

  redirect('/')
}
