'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Role, Snippet } from '@prisma/client'
import { UpdateSnippetActionRequest } from './validations'
import { logError } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import fs from 'fs'

function sanitizeFilename(input: string): string {
  return input.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

function saveSnippetToDisk(snippet: Snippet, articleOrder: number): boolean {
  const data = {
    heading: snippet.heading,
    content: snippet.content,
    task: snippet.task,
  }

  const jsonString = JSON.stringify(data)
  const sanitizedHeading = sanitizeFilename(snippet.heading)
  const filename = `./prisma/data/updates/${articleOrder}_${snippet.order}_${sanitizedHeading}.json`

  try {
    fs.writeFileSync(filename, jsonString)
    return true
  } catch (error) {
    console.error('Failed to save snippet to disk')
    return false
  }
}

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
      include: {
        article: true,
      },
    })

    // Also save the snippet to disk as JSON in the format {heading, content, task} with filename of snippet.article.id + date
    const isSavedToDisk = saveSnippetToDisk(snippet, snippet.article.order)

    revalidatePath(`/snippet/${snippetId}`)
    revalidatePath(`/snippet/${snippetId}/edit`)
    revalidatePath(`/lesson/${snippet.articleId}`)

    return { ok: true, message: `Updated DB ${isSavedToDisk ? 'and' : 'but NOT'} saved to disk.` }
  } catch (error) {
    const publicErrorMessage = 'Failed to update snippet'
    logError(publicErrorMessage, error)
    return { ok: false, message: publicErrorMessage }
  }
}
