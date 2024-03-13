import { z } from 'zod'

export const MemoryGETRequest = z.object({
  articleId: z.string().cuid().optional(),
})

export const ChatMessage = z.object({
  role: z.enum(['user', 'system', 'assistant']),
  content: z.string(),
  metadata: z.object({ hidden: z.boolean() }).optional(),
})
export type ChatMessageType = z.infer<typeof ChatMessage>

export const MemoryInfo = z.object({
  memoryId: z.string().cuid(),
  memoryChat: z.array(ChatMessage),
  snippetId: z.string().cuid(),
  snippetHeading: z.string(),
  snippetContent: z.string(),
  snippetTask: z.string(),
})
export type MemoryInfoType = z.infer<typeof MemoryInfo>

export const MemoryGETResponse = z.object({
  data: MemoryInfo.or(z.null()),
  learnedPercentage: z.number().or(z.null()),
})
export type MemoryGETResponseType = z.infer<typeof MemoryGETResponse>

export const MemoryPUTRequest = z.object({
  snippetId: z.string().cuid(),
  numberOfMistakes: z.number(),
})
export type MemoryPUTRequestType = z.infer<typeof MemoryPUTRequest>

export const MemoryPUTResponse = z.object({
  newItemLearned: z.boolean(),
  newBadgeEarned: z.boolean(),
})
export type MemoryPUTResponseType = z.infer<typeof MemoryPUTResponse>
