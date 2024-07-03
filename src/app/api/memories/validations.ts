import { z } from 'zod'

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

export const MemoryPUTRequest = z.object({
  categorySlug: z.string(),
  deckSlug: z.string(),
  snippetSlug: z.string(),
  numberOfMistakes: z.number(),
})
export type MemoryPUTRequestType = z.infer<typeof MemoryPUTRequest>

export const MemoryPUTResponse = z.object({
  newItemLearned: z.boolean(),
  dateTimePlanned: z.string(),
  isLearned: z.boolean(),
})
export type MemoryPUTResponseType = z.infer<typeof MemoryPUTResponse>

export const MemoryDELETERequest = z.object({
  deckSlug: z.string(),
  snippetSlug: z.string(),
})
export type MemoryDELETERequestType = z.infer<typeof MemoryDELETERequest>
