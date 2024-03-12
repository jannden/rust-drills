'use server'

import { User as ClerkUser, currentUser } from '@clerk/nextjs/server'
import { User as DbUser } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/utils'

export type ClerkWithDb = {
  clerk: ClerkUser
  db: DbUser
}

// * Get Clerk and Database data for User
export async function getClerkWithDb() {
  try {
    const userClerk = await currentUser()
    if (!userClerk) {
      return null
    }

    const userDb = await prisma.user.findUnique({
      where: {
        clerkId: userClerk.id,
      },
    })
    if (!userDb) {
      console.error(`User not found in database: ${userClerk.id} - ${userClerk.emailAddresses[0].emailAddress}`)
      return null
    }

    return {
      clerk: userClerk,
      db: userDb,
    }
  } catch (error) {
    logError('User not found', error)
    return null
  }
}
