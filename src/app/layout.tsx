import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import { env } from '@/env.mjs'
import { fontMono, fontSans, fontDmSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Analytics from '@/components/user/Analytics'
import TailwindIndicator from '@/components/user/TailwindIndicator'

import './globals.css'

export const metadata: Metadata = {
  title: {
    template: `%s - ${env.NEXT_PUBLIC_APP_NAME}`,
    default: env.NEXT_PUBLIC_APP_NAME,
  },
  description: 'Learn languages efficiently.',
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn('antialiased', fontSans.variable, fontMono.variable, fontDmSans.variable)}>
          <div className="flex h-screen flex-col">{children}</div>
          <TailwindIndicator />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
