import { cn } from '@/lib/utils'

import { StarFilled, StarOutline } from '@/components/user/Icons'
import { getBadges } from '@/lib/server/getBadges'

export default async function Badges() {
  const { badges } = await getBadges()

  return (
    <ul
      role="list"
      className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
    >
      {badges.map(
        (b) =>
          b && (
            <li
              key={b.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl p-6 text-center',
                !!b.level ? 'bg-indigo-400' : 'bg-gray-200'
              )}
            >
              <div>
                <b.icon className="mx-auto size-12 text-white" />
                <div className="mt-6 text-base font-semibold leading-7 tracking-tight text-white">{b.title}</div>

                {!!b.level && <div className="text-sm leading-6 text-indigo-50">{b.description}</div>}
              </div>
              {!!b.level && (
                <div className="mt-6 flex justify-center gap-1 text-xs leading-6 text-indigo-300">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < b.level ? (
                      <StarFilled key={i} className="fill-white" />
                    ) : (
                      <StarOutline key={i} className="fill-white" />
                    )
                  )}
                </div>
              )}
            </li>
          )
      )}
    </ul>
  )
}
