import { env } from '@/env.mjs'
import { OpenAI } from 'openai'

export const openai = new OpenAI({
  organization: env.OPENAI_ORGANIZATION_ID,
  apiKey: env.OPENAI_API_KEY,
})