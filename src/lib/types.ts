import { type Message } from 'ai'
import { z } from 'zod'

declare global {
  interface Window {
    LOQ: any
  }
}

export const StoryContent = z.array(
  z.object({
    name: z.string(),
    sentence: z.string(),
  })
)

export type StoryContentType = z.infer<typeof StoryContent>

export const StoriesPUT = z.object({
  storyId: z.string().cuid(),
  content: StoryContent.optional(),
  title: z.string().min(1).optional(),
})

export interface Story extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

// Type FormState is used for form submission with new (experimental) React hooks.
export type FormState = {
  message: string | null
  ok: boolean | null
}

// Every page receives these props by default
export type PageParams = {
  params: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

/**
 * API Route Request:
 * req: NextRequest
 * const body = await req.json()
 * const formData = await req.formData()
 * req.nextUrl.pathname // Given a request to /home, pathname is /home
 * req.nextUrl.searchParams // Given a request to /home?name=lee, searchParams is { 'name': 'lee' }
 * req.cookies with .set(), .get(), .getAll(), .delete(), .has(), .clear()
 */

/**
 * API Route Response:
 * return simple string with status code and headers (setting cookie and CORS):
 return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 
      'Set-Cookie': `token=${token.value}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
     },
  })

  * return JSON:
  return Response.json({ data })
*/

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = {
  isCanceled: boolean
  isPro: boolean
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: number | null
  stripeCustomerId: string | null
} & SubscriptionPlan

export enum CharType {
  NEW,
  CORRECT,
  INCORRECT,
  INCORRECT_FIXED,
  EXEMPTED,
}

export type CharInfo = {
  letter: string
  type: CharType
  isActive: boolean
  isHidden: boolean
}

export type VirtualKeyboardContextType = {
  setKeyboardHeight: React.Dispatch<React.SetStateAction<number>>
}

/* NORTHFLANK (some might not be used anymore, needs cleaning) */

export enum MemoryStrength {
  'Strong',
  'Medium',
  'Weak',
}

export type GetNextFlashcardQueryDto = {}

export type SaveProgressBodyDto = {
  wordId: number
  numberOfMistakes: number
}

export type GetAllUserProgressQueryDto = {
  paginationPage: number
}

export type SaveCorrectionBodyDto = {
  wordId: number
  correctionText: string
}

export type AddSuggestionBodyDto = {
  suggestion: string
}

export type UpvoteSuggestionBodyDto = {
  suggestionId: number
}

export type GetLearningGoalDto = {}

export type SetLearningGoalDto = {
  goal: string
}

export type Suggestion = {
  id: number
  suggestion: string
  score: number
  isOwner: boolean
  hasVoted: boolean
}

export type AppRoute = {
  id: string
  path: string
  element: React.ReactNode
  nav?: string
}

/* SAME FRONTEND AND BACKEND TYPES */

export enum CollectionType {
  WORDS = 'words',
  PHRASES = 'phrases',
}

export type SimpleFlashcard = {
  memoryId: string
  flashcardId: string
  question: string
  answer: string
  isFinished?: boolean
  memoryStrength?: number
}

export type QueryFlashcard = {
  memoryId: string
  flashcardId: string
}

export type AllUserProgress = {
  userProgress: SimpleFlashcard[]
  totalPages: number
}

export type UserSettings = {
  finishedWalktours: Array<string>
  continuousMode: boolean
  leaderboardName: string
}

export type LeaderboardData = {
  isThisUser: boolean
  leaderboardName: string
  memoryStrength: number
  numberOfWords: number
}

export type LearningGoal = {
  goal: string
  categories: string[]
}

export type AlgorithmInput = {
  repetition: number
  eFactor: number
  interval: number
  dateTimePlanned: string | null
}

export type AlgorithmOutput = {
  repetition: number
  eFactor: number
  interval: number
  dateTimePlanned: string
}

export type CategoryWithImportance = {
  categoryName: string
  importance: number
}

export type DialoguePrompt = (props: { about?: string; history?: string }) => string

export enum CEFR {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export type WordForPhrasesPrompt = { id: string; original: string; translation: string }

export type WordInPhrase = { wordProgressId: string; preview: string }

export type CardDetails = {
  memoryId: string
  snippetId: string
  memoryStrength: MemoryStrength
  dateTimePlanned: Date | null
}
