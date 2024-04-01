'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

import { env } from '@/env.mjs'
import { NavType } from '@/lib/config/global'
import { useMounted } from '@/lib/hooks/use-mounted'
import Logo from '@/components/Logo'
import NavLink from '@/components/NavLink'
import UserAvatar from '@/components/UserAvatar'

export default function Header({ navigation, copyright }: { navigation: NavType[]; copyright: string }) {
  const pathname = usePathname()
  const mounted = useMounted()
  const { isLoaded, user } = useUser()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    // hide sidebar on path change
    setMobileMenuOpen(false)
  }, [pathname])

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
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-8">
          <div className="hidden md:flex">
            <UserAvatar />
          </div>
          <button type="button" className="-m-3 p-3 md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <span className="sr-only">Open main menu</span>
            <Menu className="size-5 text-gray-900" aria-hidden="true" />
          </button>
        </div>
      </div>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="fixed inset-0 z-50 backdrop-blur-sm">
          <div className="fixed inset-0 z-50 bg-slate-300 opacity-25 " />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-50 flex h-full w-9/12 min-w-max max-w-sm flex-col justify-between overflow-y-auto bg-white px-4 pb-6 sm:ring-1 sm:ring-gray-900/10">
            <div>
              <div className="flex h-16 items-center justify-between">
                <Logo />
                <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">Close menu</span>
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>
              <ul role="list" className="flex flex-col flex-wrap justify-center gap-x-6 gap-y-1 whitespace-nowrap">
                {navigation.map((item) => (
                  <li key={item.href} className="last:border-t last:border-gray-900/10">
                    <NavLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-gray-500">
              {`${env.NEXT_PUBLIC_APP_NAME} © ${year}`}
              <br />
              {copyright}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </header>
  )
}
