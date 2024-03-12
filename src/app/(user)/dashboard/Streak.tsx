import { Check } from 'lucide-react'
import { redirect } from 'next/navigation'

import { cn, logError } from '@/lib/utils'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'
import { DateTime } from 'luxon'

enum StreakStep {
  EMPTY,
  CURRENT,
  FILLED,
}

export default async function Streak() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const getDayName = (step: number) => {
    if (step === 0) {
      return 'Yesterday'
    } else if (step === 1) {
      return 'Today'
    }
    return 'Tomorrow'
  }

  const luxonStartOfYesterday = DateTime.utc().minus({ days: 1 }).startOf('day').toISO()
  const currentStreak = await prisma.streak.findFirst({
    where: {
      userId: user.db.id,
      lastDate: {
        gte: luxonStartOfYesterday,
      },
    },
  })
  const maxStreak = await prisma.streak.aggregate({
    where: {
      userId: user.db.id,
    },
    _max: {
      daysCount: true,
    },
  })

  let streakData = [StreakStep.EMPTY, StreakStep.CURRENT, StreakStep.EMPTY]
  if (currentStreak?.lastDate) {
    try {
      const lastDate = DateTime.fromJSDate(currentStreak?.lastDate)
      const isToday = lastDate.diff(DateTime.utc().startOf('day'), 'days').days === 0
      const isYesterday = lastDate.diff(DateTime.utc().minus({ days: 1 }).startOf('day'), 'days').days === 0
      if (isYesterday) {
        streakData = [StreakStep.FILLED, StreakStep.CURRENT, StreakStep.EMPTY]
      } else if (isToday && currentStreak?.daysCount > 1) {
        streakData = [StreakStep.FILLED, StreakStep.FILLED, StreakStep.EMPTY]
      } else if (isToday && currentStreak?.daysCount === 1) {
        streakData = [StreakStep.EMPTY, StreakStep.FILLED, StreakStep.EMPTY]
      }
    } catch (e) {
      logError('luxon error for streak', e)
    }
  }

  return (
    <div>
      <div className="mb-1 whitespace-nowrap text-center text-lg font-semibold leading-6">
        Current Streak: {currentStreak?.daysCount ?? 0}
      </div>
      <div className="mb-6 whitespace-nowrap text-center text-sm leading-6 text-gray-500">
        Longest Streak: {maxStreak._max.daysCount ?? 0}
      </div>
      <ol role="list" className="mx-auto flex justify-center" aria-hidden="true">
        {streakData.map((step, stepIdx) => (
          <li key={stepIdx} className={cn(stepIdx !== streakData.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
            {step === StreakStep.FILLED ? (
              <>
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={cn('h-0.5 w-full', stepIdx === streakData.length - 2 ? 'bg-gray-200' : 'bg-indigo-600')}
                  />
                </div>
                <div className="group relative flex size-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                  <Check className="size-5 text-white" />
                  <div className="absolute -left-6 top-10 hidden w-20 text-center group-hover:block">
                    {getDayName(stepIdx)}
                  </div>
                </div>
              </>
            ) : step === StreakStep.CURRENT ? (
              <>
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                  <span className="size-2.5 rounded-full bg-indigo-600" />
                  <div className="absolute -left-6 top-10 hidden w-20 text-center group-hover:block">
                    {getDayName(stepIdx)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                  <span className="size-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                  <div className="absolute -left-6 top-10 hidden w-20 text-center group-hover:block">
                    {getDayName(stepIdx)}
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
