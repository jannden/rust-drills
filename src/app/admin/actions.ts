'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Role } from '@prisma/client'
import { env } from '@/env.mjs'
import { prisma } from '@/lib/prisma'

export async function toggleAdmin() {
  console.log('Toggling admin...')
  const user = await getClerkWithDb()
  if (!user || (user.db.role !== Role.ADMIN && user.db.email !== env.ADMIN_EMAIL)) {
    redirect('/sign-up')
  }

  const newRole = user.db.role === Role.ADMIN ? Role.USER : Role.ADMIN
  await prisma.user.update({ where: { id: user.db.id }, data: { role: newRole } })

  revalidatePath('/')
  return { ok: true, message: `Role changed to ${newRole}` }
}
