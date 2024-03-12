'use server'

import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { prisma } from '@/lib/prisma'

import Chart from './Chart'
import Scoreboard from './Scoreboard'
import Badges from './Badges'
import Streak from './Streak'

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
    <div className="flex flex-col gap-12">
      <Streak />
      <Chart
        pastSevenDays={{
          memories: memoriesCountOneWeekAgo,
        }}
      />
      <Badges />
      <Scoreboard />
    </div>
  )
}
