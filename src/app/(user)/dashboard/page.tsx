'use server'

import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'

import Chart from './Chart'
import Scoreboard from './Scoreboard'
import Badges from './Badges'
import Streak from './Streak'
import Totals from './Totals'

const calculateChange = (current: number, previous: number) => {
  if (current > previous) return previous === 0 ? 100 : Math.ceil((current / previous) * 100)
  if (current < previous) return current === 0 ? -100 : -Math.floor((previous / current) * 100)
  return 0
}

export default async function Settings() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/')
  }

  // Less than 14 days ago made with luxon
  const oneWeekAgo = DateTime.utc().minus({ days: 7 }).toJSDate()
  const twoWeeksAgo = DateTime.utc().minus({ days: 14 }).toJSDate()

  const memories = await prisma.memory.findMany({
    where: {
      userId: user.db.id,
      dateTimeRepeated: {
        gte: twoWeeksAgo,
      },
    },
  })

  const memoriesCountOneWeekAgo = memories.filter((m) => {
    return !!m.dateTimeRepeated && m.dateTimeRepeated >= oneWeekAgo
  })
  const memoriesCountTwoWeeksAgo = memories.filter((m) => {
    return !!m.dateTimeRepeated && m.dateTimeRepeated < oneWeekAgo && m.dateTimeRepeated >= twoWeeksAgo
  })
  const memoriesChange = calculateChange(memoriesCountOneWeekAgo.length, memoriesCountTwoWeeksAgo.length)

  return (
    <>
      <Streak />
      <div className="mx-auto mt-12 border-t border-gray-200 pt-10 ">
        <Totals memoriesCountOneWeekAgo={memoriesCountOneWeekAgo.length} memoriesChange={memoriesChange} />
      </div>
      <div className="mt-12 border-t border-gray-200 pt-10">
        <div className="mb-12 whitespace-nowrap text-lg font-semibold leading-6">Past week</div>
        <Chart
          pastSevenDays={{
            memories: memoriesCountOneWeekAgo,
          }}
        />
      </div>
      <div className="mt-12 border-t border-gray-200 pt-10">
        <div className="mb-6 whitespace-nowrap text-lg font-semibold leading-6">Learning Scoreboard</div>
        <Scoreboard />
      </div>
      <div className="mt-12 border-t border-gray-200 pt-10">
        <div className="mb-6 whitespace-nowrap text-lg font-semibold leading-6">Your badges</div>
        <Badges />
      </div>
    </>
  )
}
