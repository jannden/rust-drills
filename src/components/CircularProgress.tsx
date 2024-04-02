import { PropsWithChildren } from 'react'
import { type ClassValue } from 'clsx'

import { cn } from '@/lib/utils'

type Props = {
  percent: number
  filledColor?: string
  emptyColor?: string
  size?: ClassValue // should be eg. 'size-8' although ClassValue type is a bit more vagu
}

export default function CircularProgress({
  children,
  percent,
  filledColor,
  emptyColor,
  size,
}: PropsWithChildren<Props>) {
  const progress = Math.floor((percent * 283) / 100)
  return (
    <div className={cn(size ? size : 'size-8')}>
      <div className={cn('relative flex items-center justify-center rounded', size ? size : 'size-8')}>
        <svg className={cn('absolute block', size ? size : 'size-8')} viewBox="0 0 100 100">
          <circle className={cn('fill-none stroke-gray-200 stroke-[7]', emptyColor)} cx="50" cy="50" r="45"></circle>
          <circle
            className={cn('origin-center -rotate-90 fill-none stroke-orange-400 stroke-[7]', filledColor)}
            style={{ strokeDasharray: `${progress} 283` }}
            cx="50"
            cy="50"
            r="45"
          ></circle>
        </svg>
        {children}
      </div>
    </div>
  )
}
