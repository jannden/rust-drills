'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

import { useMounted } from '@/lib/hooks/use-mounted'
import Logo from '@/components/Logo'
import UserAvatar from '@/components/UserAvatar'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'

export default function Header() {
  const mounted = useMounted()
  const { isLoaded, user } = useUser()


  useEffect(() => {
    if (!isLoaded || !mounted) return
    if (process.env.NODE_ENV === 'development') return
    if (typeof window !== 'undefined') {
      LogRocket.init('wwsywf/rust-drills')

      if (user?.emailAddresses?.[0]?.emailAddress) {
        LogRocket.identify(user.emailAddresses[0].emailAddress)
      }

      if (typeof setupLogRocketReact === 'function') {
        setupLogRocketReact(LogRocket)
      }
    }
  }, [mounted, user?.emailAddresses, isLoaded])

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-8 md:px-6 lg:px-8">
        <div className="flex-1">
          <Link href="/" className="inline">
            <Logo clickable />
          </Link>
        </div>
        <UserAvatar />
      </div>
    </header>
  )
}
