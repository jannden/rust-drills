import { type ClassValue } from 'clsx'

import { cn } from '@/lib/utils'

type BarPart = {
  barName: string
  color: ClassValue
  value: number
}

type Props = {
  columnName: string
  maxValue: number
  maxHeight: number
  barParts: BarPart[]
}

export default function ChartBar({ columnName, maxValue, maxHeight, barParts }: Props) {
  return (
    <div className="relative flex grow flex-col items-center pb-6">
      {barParts.map((b, index) => (
        <>
          <div
            key={b.barName}
            className={cn(
              'relative flex w-full justify-center border-2 border-transparent hover:border-indigo-600',
              b.color,
              index === 0 && `peer/0`,
              index === 1 && `peer/1`,
              index === 2 && `peer/2`,
              index === 3 && `peer/3`,
              index === 4 && `peer/4`
            )}
            style={{ height: `${Math.ceil((b.value / maxValue) * maxHeight)}px` }}
          ></div>
          <div
            className={cn(
              'absolute top-0 z-10 -mt-6 hidden overflow-visible whitespace-nowrap text-xs text-gray-500',
              index === 0 && `peer-hover/0:block`,
              index === 1 && `peer-hover/1:block`,
              index === 2 && `peer-hover/2:block`,
              index === 3 && `peer-hover/3:block`,
              index === 4 && `peer-hover/4:block`
            )}
          >
            <p>
              {b.barName} - {b.value}
            </p>
          </div>
        </>
      ))}
      <div className="absolute bottom-0 hidden text-xs text-gray-500 lg:block">{columnName}</div>
    </div>
  )
}
