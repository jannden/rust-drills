'use client'

import { Zap } from 'lucide-react'
import Link from 'next/link'
import CircularProgress from '@/components/CircularProgress'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useMounted } from '@/lib/hooks/use-mounted'
import { useEffect, useState } from 'react'

export default function Energy({ energyTimestamp }: { energyTimestamp: number }) {
  const pathname = usePathname()
  const mounted = useMounted()
  const [energyPercentage, setEnergyPercentage] = useState<number | null>(null)

  useEffect(() => {
    if (!mounted) return
    const fetchEnergy = async () => {
      const res = await fetch('/api/energy', { cache: 'no-cache' })
      if (!res.ok) return
      try {
        const { energy, dailyLimit } = await res.json()
        const percentage = (energy / dailyLimit) * 100
        setEnergyPercentage(percentage > 0 ? percentage : 0)
      } catch (e) {
        console.error(e)
      }
    }
    fetchEnergy()
  }, [mounted, energyTimestamp])

  return (
    <Link
      href="/energy"
      className={cn(
        pathname.startsWith('/energy')
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-900 hover:bg-gray-50 hover:text-orange-600',
        'flex items-center justify-end gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-orange-600'
      )}
      aria-current={pathname.startsWith('/energy') ? 'page' : undefined}
    >
      <span className="sr-only">Energy</span>
      {!mounted || energyPercentage === null ? (
        <div className="flex size-8 items-center justify-center">
          <Zap className="size-4" aria-hidden="true" />
        </div>
      ) : (
        <CircularProgress percent={energyPercentage}>
          <Zap className="size-4" aria-hidden="true" />
        </CircularProgress>
      )}
    </Link>
  )
}
