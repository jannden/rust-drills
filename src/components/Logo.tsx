import { Drill } from 'lucide-react'

import { env } from '@/env.mjs'
import { cn } from '@/lib/utils'

export function LogoIcon() {
  return <Drill className="size-4 transition-transform group-hover:rotate-45" />
}

export default function Logo({ clickable }: { clickable?: boolean }) {
  return (
    <div
      className={cn(
        'group inline-flex items-center gap-x-3 text-xl transition hover:text-orange-700',
        clickable && 'cursor-pointer'
      )}
    >
      <LogoIcon />
      {env.NEXT_PUBLIC_APP_NAME}
    </div>
  )
}
