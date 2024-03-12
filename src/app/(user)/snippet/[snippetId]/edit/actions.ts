'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Role } from '@prisma/client'
import { UpdateSnippetActionRequest } from './validations'
import { logError } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export async function updateSnippet(formData: FormData) {
  const user = await getClerkWithDb()
  if (!user || user.db.role !== Role.ADMIN) {
    redirect('/sign-up')
  }

  const formDataEntriesWithoutArrays = Object.fromEntries(formData.entries())
  const body = UpdateSnippetActionRequest.safeParse(formDataEntriesWithoutArrays)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return { ok: false, message: publicErrorMessage }
  }

  const { snippetId, heading, content, task } = body.data

  try {
    const snippet = await prisma.snippet.update({
      where: {
        id: snippetId,
      },
      data: {
        heading,
        content,
        task,
      },
    })

    revalidatePath(`/snippet/${snippetId}`)
    revalidatePath(`/snippet/${snippetId}/edit`)
    revalidatePath(`/lesson/${snippet.articleId}`)

    return { ok: true, message: null }
  } catch (error) {
    const publicErrorMessage = 'Failed to update snippet'
    logError(publicErrorMessage, error)
    return { ok: false, message: publicErrorMessage }
  }
}
