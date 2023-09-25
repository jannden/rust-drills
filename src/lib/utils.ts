import { type ClassValue, clsx } from "clsx"
import { twMerge } from 'tailwind-merge'
import { DateTime } from 'luxon'

import { env } from '@/env.mjs'
import { projectSettings } from '@/lib/config/global'
import { diacriticChars, keyboardLayouts } from '@/lib/config/keyboard'
import { MemoryStrength } from './types'

export const allDiacritics: string = Object.keys(diacriticChars).join('')

export const allSlavonic: string =
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯЁЂЃЄЅІЇЈЉЊЋЌЎЏҐабвгдежзийклмнопрстуфхцчшщъыьэюяёђѓєѕіїјљњћќўџґ'

export const virtualKeyboardLetters = Object.values(keyboardLayouts)
  .map((lang) => lang.default)
  .flat()
  .join('')
  .replace(/[ =]/g, '')

export const regexIsLetter = new RegExp(`[${virtualKeyboardLetters}]`, 'i')

export const getFirstLetterIndex = (chars: string[]) => {
  return chars.findIndex((char) => regexIsLetter.test(char))
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getToday = () => DateTime.utc().toISODate()

export const removeNullPropertiesFromObject = (obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

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

export const calculateMemoryStrength = (dateTimePlanned: string | null): number => {
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

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function isValidUrl(url: string | null) {
  if (!url) return false

  let res
  try {
    res = new URL(url)
  } catch (_) {
    return false
  }

  return res.protocol === 'http:' || res.protocol === 'https:'
}

export function extractFromQuotes(text: string | null) {
  if (!text) return null
  const match = text.match(/"([^"]*)"/)
  if (match) {
    try {
      const extractedText = match[1]
      return extractedText
    } catch {
      return null
    }
  } else {
    return null
  }
}

/**
 * Error handling
 * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 */

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

export function pickFromObject<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  if (!obj) {
    console.error('pickFromObject: obj is null or undefined')
    return {} as Pick<T, K>
  }
  
  const result: Partial<Pick<T, K>> = {}
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result as Pick<T, K>
}

export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

/**
 * Determining whether user has enough elements (such as words) to create new combinations (such as phrases)
 */
export function canGenerateNewCombinations(elementsCount: number, oldCombinationsCount: number, newCombinationsCount: number): boolean {
  return newCombinationsCount * projectSettings.oneCombinationPerXElements <= elementsCount - oldCombinationsCount * projectSettings.oneCombinationPerXElements
}