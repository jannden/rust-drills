import { z } from 'zod'

export const AuthPOSTRequest = z.object({
  email: z.string().email(),
})

export const AuthGETRequest = z.object({
  email: z.string().email(),
})

export const AuthGETResponse = z.object({})
export type AuthGETResponseType = z.infer<typeof AuthGETResponse>
