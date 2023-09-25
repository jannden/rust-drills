'use server'

import { DateTime } from 'luxon'
import { Prompt } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { defaultAI } from '@/lib/config/ai'

type EnergyData = {
  prompts: Prompt[]
  energy: number
  dailyLimit: number
  totalSpent: number
}

// * Get energy data for user
export async function getEnergy(userId: string): Promise<EnergyData | null> {
  let prompts: Prompt[]
  try {
    prompts = await prisma.prompt.findMany({
      where: {
        userId,
        createdAt: {
          gte: DateTime.now().minus({ days: 1 }).toJSDate(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Error getting completions', error)
    return null
  }

  if (!prompts) return null

  const dailyLimit = defaultAI.dailyEnergy

  const totalSpent = prompts.reduce((acc, completion) => acc + getSpentTokens(completion), 0)

  const energy = dailyLimit - totalSpent

  return {
    energy,
    dailyLimit,
    totalSpent,
    prompts,
  }
}

// * Get spent tokens for prompt
export const getSpentTokens = (prompt: Prompt) => {
  const maxTokens = prompt?.maxTokens ?? 0
  const completionTokens = prompt?.completionTokens
  const requestTokens = prompt?.promptTokens ?? 0
  const responseTokens = completionTokens ?? maxTokens
  return requestTokens + responseTokens
}
