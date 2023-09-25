import { Bookmark, Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'

const defaultBadges = [
  {
    id: 1,
    icon: Bookmark,
    title: 'snippetCollector',
    levels: [0, 10, 50, 100, 500, 1000],
  },
  {
    id: 2,
    icon: Calendar,
    title: 'streak',
    levels: [0, 3, 7, 14, 21, 30],
  },
]

const getLevel = (levels: number[], count: number) => {
  const level = levels.findIndex((l) => count <= l)
  if (level === -1) {
    return levels.length - 1
  }
  if (level === 0) {
    return 0
  }
  return level - 1
}

export async function getBadges() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const badgeDescriptions: Record<number, Array<string>> = {
    1: [
      '',
      '10 Snippets Collected',
      '50 Snippets Collected',
      '100 Snippets Collected',
      '500 Snippets Collected',
      '1000 Snippets Collected',
    ],
    2: ['', 'Three Days Streak', 'One Week Streak', 'Two Weeks Streak', 'Three Weeks Streak', 'One Month Streak'],
  }

  const memories = await prisma.memory.findMany({
    where: {
      userId: user.db.id,
      NOT: {
        dateTimeRepeated: null,
      },
    },
  })

  const maxStreak = await prisma.streak.findFirst({
    where: {
      userId: user.db.id,
    },
    orderBy: {
      daysCount: 'desc',
    },
  })
  const streakCount = maxStreak?.daysCount || 0

  const badges = defaultBadges.map((b) => {
    let lev = 0
    switch (b.id) {
      case 1:
        lev = getLevel(b.levels, memories.length)
        return {
          ...b,
          level: lev,
          description: badgeDescriptions[b.id]?.[lev],
        }
      case 2:
        lev = getLevel(b.levels, streakCount)
        return {
          ...b,
          level: lev,
          description: badgeDescriptions[b.id]?.[lev],
        }
      default:
        throw new Error('Invalid badge id')
    }
  })

  const totalBadgeLevels = badges.reduce((acc, b) => acc + b.level, 0)

  return {
    badges,
    totalBadgeLevels,
  }
}
