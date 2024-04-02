'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClassValue } from 'clsx'

import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

interface HeadingProps {
  heading: string
  description?: string
  back?: string
  children?: React.ReactNode
  tabs?: {
    title: string
    href: string
  }[]
  className?: ClassValue
}

export default function Heading({ heading, description, back, children, tabs, className }: HeadingProps) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-8', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 sm:flex-nowrap">
        <div>
          <div className="relative flex items-center gap-x-2">
            {back && (
              <Link
                href={back}
                className="group -ml-3 block w-8 text-right text-sm font-medium text-stone-400 transition hover:-mb-0.5 hover:text-orange-700"
              >
                <span className="absolute inset-x-0 -top-px bottom-0" />
                <ChevronLeft className="inline size-6 group-hover:size-7" />
              </Link>
            )}
            <h3 className="text-2xl text-gray-900 [text-wrap:balance]">{heading}</h3>
          </div>
          {description && <p className="mt-1 text-sm text-gray-500 [text-wrap:balance]">{description}</p>}
        </div>
        <div className="mt-3 shrink-0 sm:ml-3 sm:mt-0">{children}</div>
      </div>
      {tabs?.length && (
        <div className="mt-3 border-b border-gray-200 sm:mt-4">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, tabIdx) => (
              <Link
                key={tabIdx}
                href={tab.href}
                className={cn(
                  pathname.startsWith(tab.href)
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 pb-4 text-sm font-medium'
                )}
                aria-current={pathname.startsWith(tab.href) ? 'page' : undefined}
              >
                {tab.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
