import { z } from 'zod'

import { defaultAI } from '@/lib/config/ai'

const roles = z.enum(['user', 'system', 'assistant'] as const)
const responseTypes = z.enum(['text', 'json_object'] as const)

export const AiPOST = z.object({
  stream: z.boolean().optional(),
  promptId: z.string().cuid().optional(),
  promptType: z.string(),

  prompt: z.string().optional(),
  messages: z.array(z.object({ role: roles, content: z.string() })).optional(),

  maxTokens: z.number().min(defaultAI.maxTokens.min).max(defaultAI.maxTokens.max),

  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  responseType: responseTypes.optional(),

  phraseId: z.string().cuid().optional(),
  storyId: z.string().cuid().optional(),
  chatId: z.string().cuid().optional(),
  threadId: z.string().cuid().optional(),
})
