import Image from 'next/image'

import logoSvg from '@/images/logo.svg'
import { env } from '@/env.mjs'
import { Drill } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Logo({ clickable }: { clickable?: boolean }) {
  return (
    <div
      className={cn(
        'group inline-flex items-center gap-x-3 text-xl transition hover:text-orange-700',
        clickable && 'cursor-pointer'
      )}
    >
      <Drill className="size-4 transition-transform group-hover:rotate-45" />
      {env.NEXT_PUBLIC_APP_NAME}
    </div>
  )
}
