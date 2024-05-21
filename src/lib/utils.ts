import { type ClassValue, clsx } from "clsx"
import { twMerge } from 'tailwind-merge'
import { DateTime } from 'luxon'

import { env } from '@/env.mjs'
import { MemoryStrength } from '@/lib/types'
import { Prompt } from '@prisma/client'

/**
 * Calculates difference in days between two supplied ISO strings
 * @param futureIso String in ISO format or null
 * @param pastIso String in ISO format or undefined (defaults to now)
 * @returns Difference in days. Bellow zero means the first argument (futureIso) is in the past (less then the second argument / now)
 */
export const differenceInDays = (futureIso: string | null, pastIso?: string | null | undefined) => {
  let dateTimePast: DateTime

  if (futureIso === null) {
    // For the sake of the algorithm, we assume that the future is now, and there is no difference between now and now
    return 0
  }
  const dateTimeFuture = DateTime.fromISO(futureIso)

  if (!pastIso) {
    // Make it the current time by default
    dateTimePast = DateTime.utc()
  } else {
    dateTimePast = DateTime.fromISO(pastIso)
  }

  if (!dateTimeFuture.isValid || !dateTimePast.isValid) {
    throw new Error('Invalid ISO string.')
  }

  const differenceInDays = dateTimeFuture.diff(dateTimePast, 'days')
  if (!differenceInDays.isValid) {
    throw new Error("Difference couldn't be calculated.")
  }
  return differenceInDays.days
}

export const calculateMemoryStrength = (dateTimePlanned: string | null): MemoryStrength => {
  const inFutureDays = differenceInDays(dateTimePlanned)

  if (inFutureDays >= 1) {
    return MemoryStrength.Strong
  }

  if (inFutureDays <= -1) {
    return MemoryStrength.Weak
  }

  return MemoryStrength.Medium
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ErrorWithMessage = {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message
}

/**
 * Logs an error to the console with a message.
 * Use like this:
   try {
    ...
   } catch (error) {
    const publicErrorMessage = 'Billing form action error'
    logError(publicErrorMessage, error)
    return { message: publicErrorMessage, ok: false }
  }
*/
export function logError(publicMessage: string, error: unknown): void {
  const isServer = typeof window === 'undefined'
  if (isServer) {
    console.error(`[server] ${publicMessage}${error ? ` -> ${getErrorMessage(error)}` : ''}`)
    return
  }
  // Don't leak sensitive info
  console.error('[client]', publicMessage)
}

// Get spent tokens for prompt
export function calculateTotalTokens(prompt: Prompt): number {
  const maxTokens = prompt?.maxTokens ?? 0
  const completionTokens = prompt?.completionTokens ?? 0
  const requestTokens = prompt?.promptTokens ?? 0
  const responseTokens = completionTokens ?? maxTokens
  const totalTokens = requestTokens ? requestTokens + responseTokens : 0

  return totalTokens
}

export function formatDate(date: string) {
  const dateObj = DateTime.fromISO(date)
  const isToday = dateObj.hasSame(DateTime.now(), 'day')
  const isThisYear = dateObj.hasSame(DateTime.now(), 'year')
  const hours = isToday ? dateObj.toFormat('hh:mm a') : ''
  const days = isThisYear ? DateTime.fromISO(date).toFormat('d LLL') : DateTime.fromISO(date).toFormat('d LLL yyyy')
  return { hours, days }
}