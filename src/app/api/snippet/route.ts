import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { Prisma, Role } from '@prisma/client'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/utils'
import { SnippetGETRequest, SnippetGETResponseType, SnippetPUTRequest, SnippetPUTResponseType } from './validations'

// * Get Snippet
export async function GET(req: Request): Promise<NextResponse<SnippetGETResponseType | { error: string }>> {
  const user = await getClerkWithDb()
  if (!user || user.db.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const body = SnippetGETRequest.safeParse({
    snippetId: searchParams.get('snippetId') ?? undefined,
  })
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  const { snippetId } = body.data

  const snippet = await prisma.snippet.findUnique({
    where: {
      id: snippetId,
    },
  })

  if (!snippet) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
  }

  return NextResponse.json({
    snippetId: snippet.id,
    snippetHeading: snippet.heading,
    snippetContent: snippet.content,
    snippetTask: snippet.task,
  })
}

// * Update Snippet
export async function PUT(req: Request): Promise<NextResponse<SnippetPUTResponseType | { error: string }>> {
  const user = await getClerkWithDb()
  if (!user || user.db.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = SnippetPUTRequest.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  const { snippetId, snippetHeading, snippetContent, snippetTask } = body.data

  // TODO

  return NextResponse.json({ snippetId, snippetHeading, snippetContent, snippetTask })
}
