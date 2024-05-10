'use server'

import { ToastContainer } from 'react-toastify'
import { ClerkProvider } from '@clerk/nextjs'

import { cn } from '@/lib/utils'
import { fontDmSans, fontMono, fontSans } from '@/lib/fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TailwindIndicator from '@/components/TailwindIndicator'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import './code.css'

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
          <TailwindIndicator />
        </body>
      </html>
    </ClerkProvider>
  )
}
