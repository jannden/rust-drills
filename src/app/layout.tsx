'use server'

import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'

import { env } from '@/env.mjs'
import { cn } from '@/lib/utils'
import { fontDmSans, fontMono, fontSans } from '@/lib/fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TailwindIndicator from '@/components/TailwindIndicator'

import 'react-toastify/dist/ReactToastify.css'
import 'highlight.js/styles/atom-one-light.css'
import './globals.css'

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn('antialiased', fontSans.variable, fontMono.variable, fontDmSans.variable)}>
          <div className="flex h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:flex-auto md:px-6 lg:px-8">{children}</main>
            <Footer />
            <ToastContainer />
          </div>
          <Script async defer src={`https://tools.luckyorange.com/core/lo.js?site-id=${env.NEXT_PUBLIC_LO_SITE_ID}`} />
          <TailwindIndicator />
        </body>
      </html>
    </ClerkProvider>
  )
}
