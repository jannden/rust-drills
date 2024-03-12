import { z } from 'zod'

export const SnippetGETRequest = z.object({
  snippetId: z.string().cuid(),
})

export const SnippetGETResponse = z.object({
  snippetId: z.string().cuid(),
  snippetHeading: z.string(),
  snippetContent: z.string(),
  snippetTask: z.string(),
})
export type SnippetGETResponseType = z.infer<typeof SnippetGETResponse>

export const SnippetPUTRequest = z.object({
  snippetId: z.string(),
  snippetHeading: z.string(),
  snippetContent: z.string(),
  snippetTask: z.string(),
})
export type SnippetPUTRequestType = z.infer<typeof SnippetPUTRequest>

export const SnippetPUTResponse = z.object({
  snippetId: z.string(),
  snippetHeading: z.string(),
  snippetContent: z.string(),
  snippetTask: z.string(),
})
export type SnippetPUTResponseType = z.infer<typeof SnippetPUTResponse>
