'use server'

import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'

import { env } from '@/env.mjs'
import { cn } from '@/lib/utils'
import { navigation } from '@/lib/config/global'
import { fontDmSans, fontMono, fontSans } from '@/lib/fonts'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Analytics from '@/components/Analytics'
import TailwindIndicator from '@/components/TailwindIndicator'

import 'react-toastify/dist/ReactToastify.css'
import 'highlight.js/styles/atom-one-light.css'
import './globals.css'

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const extendedNavigation = [
    ...navigation,
    { name: 'settings', icon: 'User', href: '/settings', activePathnames: ['/settings'] },
  ]

  const copyright = 'All rights reserved.'

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn('antialiased', fontSans.variable, fontMono.variable, fontDmSans.variable)}>
          <div className="flex h-screen flex-col">
            <Header navigation={extendedNavigation} copyright={copyright} />
            <div className="mx-auto w-full max-w-6xl flex-1 pt-16 md:flex md:gap-x-12 md:px-6 lg:gap-x-16 lg:px-8">
              <Sidebar />
              <main className="flex-1 px-4 py-6 sm:px-6 sm:py-12 md:flex-auto md:px-12">{children}</main>
            </div>
            <ToastContainer />
          </div>
          <Script async defer src={`https://tools.luckyorange.com/core/lo.js?site-id=${env.NEXT_PUBLIC_LO_SITE_ID}`} />
          <TailwindIndicator />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
