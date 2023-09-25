import { NextResponse } from 'next/server'
import { AuthGETRequest, AuthGETResponseType, AuthPOSTRequest } from './validations'
import { logError } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

// * Save user's trying to sign in so that we know what native language they use when Clerk calls our webhook
export async function POST(req: Request): Promise<NextResponse<null | { error: string }>> {
  const reqBody = await req.json()
  const body = AuthPOSTRequest.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error ?? 'Api AuthPOSTRequest validation failed')
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  try {
    await prisma.signIn.create({
      data: {
        email: body.data.email,
      },
    })

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    const publicErrorMessage = 'Failed to save sign in attempt'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }
}

export async function GET(req: Request): Promise<NextResponse<null | { error: string }>> {
  const { searchParams } = new URL(req.url)
  const body = AuthGETRequest.safeParse({
    email: searchParams.get('email'),
  })
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error ?? 'Api AuthGETRequest validation failed')
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  try {
    const signInData = await prisma.signIn.findFirst({
      where: {
        email: body.data.email,
        createdAt: {
          gt: new Date(Date.now() - 10 * 60 * 1000), // ten minutes ago
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!signInData) {
      const publicErrorMessage = 'No recent sign in attempt found'
      console.error(publicErrorMessage)
      return NextResponse.json({ error: publicErrorMessage }, { status: 404 })
    }

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    const publicErrorMessage = 'Failed to save sign in attempt'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }
}
