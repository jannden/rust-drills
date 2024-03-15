import { z } from 'zod'

export const UpdateSnippetActionRequest = z.object({
  snippetId: z.string().cuid(),
  heading: z.string().min(1).max(100),
  content: z.string().min(1),
  task: z.string().min(1),
})
