import Image from 'next/image'

import logoSvg from '@/images/logo.svg'
import { env } from '@/env.mjs'
import { Drill } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Logo({ clickable }: { clickable?: boolean }) {
  return (
    <div className="group flex items-center gap-x-3">
      <Drill className={cn('size-4', clickable && 'transition group-hover:stroke-orange-700')} />
      <div className={cn('text-xl', clickable && 'cursor-pointer transition group-hover:text-orange-700')}>
        {env.NEXT_PUBLIC_APP_NAME}
      </div>
    </div>
  )
}
