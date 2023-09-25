import { z } from 'zod'

export const ChatPUT = z.object({
  chatId: z.string().cuid(),
  content: z.string().min(1),
})
