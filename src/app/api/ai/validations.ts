import { z } from 'zod'

import { defaultAI } from '@/lib/config/ai'

const roles = z.enum(['user', 'system', 'assistant'] as const)
const responseTypes = z.enum(['text', 'json_object'] as const)

export const AiPOST = z.object({
  stream: z.boolean().optional(),
  promptId: z.string().cuid().optional(),

  prompt: z.string().optional(),
  messages: z.array(z.object({ role: roles, content: z.string() })).optional(),

  maxTokens: z.number().min(defaultAI.maxTokens.min).max(defaultAI.maxTokens.max),

  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  responseType: responseTypes.optional(),

  memoryId: z.string().cuid().optional(),
  openaiThreadId: z.string().cuid().optional(),
})
