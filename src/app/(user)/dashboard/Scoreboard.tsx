import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { cn } from '@/lib/utils'
import { DateTime } from 'luxon'
import { redirect } from 'next/navigation'

export default async function Scoreboard() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect(`/sign-up`)
  }

  const luxonStartOfToday = DateTime.utc().startOf('day').toISO()
  const streaks = await prisma.streak.findMany({
    where: {
      todayLearnedCount: {
        gt: 0,
      },
      lastDate: {
        gte: luxonStartOfToday,
      },
      OR: [
        { userId: user.db.id },
        {
          user: {
            publicNameApproved: true,
            NOT: {
              publicName: null,
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          publicName: true,
        },
      },
    },
    orderBy: {
      todayLearnedCount: 'desc',
    },
    take: 5,
  })

  console.log(streaks)

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <tbody>
        {streaks.map((streak, idx) => (
          <tr key={streak.id} className={cn(user.db.id === streak.userId && 'bg-indigo-50')}>
            <td className="px-3 text-sm text-gray-500">{idx + 1}</td>
            <td className="w-full px-3 text-sm font-medium text-gray-900">
              {user.db.id === streak.userId && !!streak.user.publicName === false
                ? `Me (${streak.user.publicName})`
                : streak.user.publicName}
            </td>
            <td className="px-3 py-4 text-right text-sm text-gray-500">{streak.todayLearnedCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
