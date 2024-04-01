'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

import { useMounted } from '@/lib/hooks/use-mounted'
import Logo from '@/components/Logo'
import UserAvatar from '@/components/UserAvatar'

export default function Header() {
  const mounted = useMounted()
  const { isLoaded, user } = useUser()

  // Lucky Orange
  useEffect(() => {
    if (!isLoaded || !mounted || !user?.emailAddresses) return
    window.LOQ = window.LOQ || []
    window.LOQ.push([
      'ready',
      function (LO: any) {
        LO.$internal.ready('privacy').then(function () {
          LO.privacy.setConsentStatus(true) // TODO: This should be accepted by the user (GDPR)
        })
        LO.$internal.ready('visitor').then(function () {
          LO.visitor.identify({ email: user.emailAddresses[0].emailAddress })
        })
      },
    ])
  }, [mounted, user?.emailAddresses, isLoaded])

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-8 sm:px-6 lg:px-8">
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
