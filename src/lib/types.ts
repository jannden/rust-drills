declare global {
  interface Window {
    LOQ: any
  }
}

// Every page receives these props by default
export type PageParams = {
  params: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Type FormState is used for form submission with new (experimental) React hooks.
export type FormState = {
  message: string | null
  ok: boolean | null
}

/**
 * API Route Request:
 * req: NextRequest
 * const body = await req.json()
 * const formData = await req.formData()
 * req.nextUrl.pathname // Given a request to /home, pathname is /home
 * req.nextUrl.searchParams // Given a request to /home?name=lee, searchParams is { 'name': 'lee' }
 * req.cookies with .set(), .get(), .getAll(), .delete(), .has(), .clear()
 */

/**
 * API Route Response:
 * return simple string with status code and headers (setting cookie and CORS):
 return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 
      'Set-Cookie': `token=${token.value}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
     },
  })

  * return JSON:
  return Response.json({ data })
*/

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = {
  isCanceled: boolean
  isPro: boolean
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: number | null
  stripeCustomerId: string | null
} & SubscriptionPlan

export enum MemoryStrength {
  'Strong' = 'Strong',
  'Medium' = 'Medium',
  'Weak' = 'Weak',
}

export type AlgorithmInput = {
  repetition: number
  eFactor: number
  interval: number
  dateTimePlanned: string | null
}

export type AlgorithmOutput = {
  repetition: number
  eFactor: number
  interval: number
  dateTimePlanned: string
}

export type CardDetails = {
  articleId: string
  articleTitle: string
  snippetId: string
  snippetHeading: string
  memoryId: string | null
  dateTimePlanned: Date | null
  memoryStrength: MemoryStrength | null
}
