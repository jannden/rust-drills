import * as z from 'zod'

export const PromptsPATCH = z.object({
  promptType: z.string(),
  completion: z.string().min(1),

  promptId: z.string().cuid().optional(),

  wordId: z.string().optional(),
  phraseId: z.string().optional(),
  storyId: z.string().cuid().optional(),
  chatId: z.string().cuid().optional(),
  threadId: z.string().cuid().optional(),
})
