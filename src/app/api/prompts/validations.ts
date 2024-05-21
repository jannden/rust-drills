import * as z from 'zod'

export const PromptsPATCH = z.object({
  completion: z.string().min(1),

  memoryId: z.string().cuid().optional(),
  promptId: z.string().cuid().optional(),
  openaiThreadId: z.string().cuid().optional(),
})

export const PromptsDELETE = z.object({
  memoryId: z.string().cuid(),
})
