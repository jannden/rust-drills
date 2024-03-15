'use server'

import { SignedIn } from '@clerk/nextjs'
import { ToastContainer } from 'react-toastify'

import Header from '@/components/user/Header'
import Sidebar from '@/components/user/Sidebar'

import 'react-toastify/dist/ReactToastify.css'
import 'highlight.js/styles/atom-one-light.css'
import { navigation } from '@/lib/config/global'

interface TailwindLayoutProps {
  children: React.ReactNode
}

export default async function TailwindLayout({ children }: TailwindLayoutProps) {
  const extendedNavigation = [
    ...navigation,
    { name: 'settings', icon: 'User', href: '/settings', activePathnames: ['/settings'] },
  ]

  const copyright = 'All rights reserved.'

  return (
    <>
      <Header navigation={extendedNavigation} copyright={copyright} />
      <div className="mx-auto w-full max-w-6xl flex-1 pt-16 md:flex md:gap-x-12 md:px-6 lg:gap-x-16 lg:px-8">
        <SignedIn>
          <Sidebar />
        </SignedIn>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-12 md:flex-auto md:px-12">{children}</main>
      </div>
      <ToastContainer />
    </>
  )
}
