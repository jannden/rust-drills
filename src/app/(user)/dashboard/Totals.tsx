import { Book, BookOpen, Bookmark, ArrowUp, ArrowDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const getChangeColor = (change: number) => {
  if (change > 50) return { bg: 'bg-emerald-100', text: 'text-emerald-800' }
  if (change >= 0) return { bg: 'bg-indigo-100', text: 'text-indigo-800' }
  return { bg: 'bg-red-100', text: 'text-red-800' }
}

export default async function Totals({
  memoriesCountOneWeekAgo,
  memoriesChange,
}: {
  memoriesCountOneWeekAgo: number
  memoriesChange: number
}) {
  const stats = [
    {
      name: 'Snippets learned',
      stat: memoriesCountOneWeekAgo,
      icon: Bookmark,
      change: memoriesChange,
      ...getChangeColor(memoriesChange),
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-12 sm:grid-cols-2">
      {stats.map((item) => (
        <div key={item.name} className="justify-self-center overflow-hidden rounded-lg">
          <dt className="mb-3 whitespace-nowrap text-lg font-semibold leading-6">{item.name}</dt>
          <dd className="flex items-center justify-center gap-6">
            <div className="flex items-center justify-center gap-1">
              <item.icon className="size-6 text-indigo-600" aria-hidden="true" />
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">{item.stat}</div>
            </div>

            {!!item.change && (
              <div
                className={cn(
                  'inline-flex items-baseline whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium',
                  getChangeColor(item.change).bg,
                  getChangeColor(item.change).text
                )}
              >
                {item.change < 0 ? (
                  <ArrowDown className={cn('size-5', getChangeColor(item.change).text)} aria-hidden="true" />
                ) : (
                  <ArrowUp className={cn('size-5', getChangeColor(item.change).text)} aria-hidden="true" />
                )}
              </div>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
