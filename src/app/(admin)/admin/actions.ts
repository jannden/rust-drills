'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Role } from '@prisma/client'
import { update } from '../../../../prisma/seed'

export async function updateSnippet(formData: FormData) {
  const user = await getClerkWithDb()
  if (!user || user.db.role !== Role.ADMIN) {
    redirect('/sign-up')
  }

  try {
    await update()
  } catch (error) {
    return { ok: false, message: `Failed ${error}` }
  }

  revalidatePath('/')
  return { ok: true, message: 'Update complete.' }
}