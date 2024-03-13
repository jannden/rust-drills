import { z } from 'zod'

export const ChatPUT = z.object({
  memoryId: z.string().cuid(),
  content: z.string().min(1),
})
