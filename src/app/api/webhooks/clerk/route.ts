import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, EmailJSON } from '@clerk/nextjs/server'
import { env } from '@/env.mjs'
import { sendEmailVerificationCode } from '@/lib/server/sendEmail'

export async function GET(req: Request) {
  return new Response('Hello', { status: 200 })
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Webhook Signing Secret from Clerk is missing!')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'email.created') {
    const emailEvent = evt.data as unknown as EmailJSON
    if (emailEvent.delivered_by_clerk) {
      return new Response('', { status: 200 })
    }
    const userEmail = emailEvent.to_email_address
    const emailSpec = emailEvent.data as unknown as {
      otp_code: string
      requested_at: string
      requested_by: string
      requested_from: string
    }
    if (!userEmail || !emailSpec.otp_code) {
      console.error('Email event missing to_email_address or otp_code')
      return new Response('Error occured', {
        status: 400,
      })
    }

    let locale = 'en'

    sendEmailVerificationCode({
      locale,
      userEmail,
      data: {
        otpCode: emailSpec.otp_code,
        requestedAt: emailSpec.requested_at,
        requestedBy: emailSpec.requested_by,
        requestedFrom: emailSpec.requested_from,
      },
    })
    return new Response('', { status: 200 })
  }

  const publicErrorMessage = 'Webhook Event Type - not implemented'
  console.error(`Webhook with and ID of ${id} and type of ${eventType}: ${publicErrorMessage}`)
  return new Response(publicErrorMessage, {
    status: 500,
  })
}
