'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClassValue } from 'clsx'

import { cn } from '@/lib/utils'

interface HeadingProps {
  heading: string
  description?: string
  children?: React.ReactNode
  tabs?: {
    title: string
    href: string
  }[]
  className?: ClassValue
}

export default function Heading({ heading, description, children, tabs, className }: HeadingProps) {
  const pathname = usePathname()

  return (
    <div className={cn('mb-6 border-b border-gray-200 pb-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 sm:flex-nowrap">
        <div>
          <h3 className="mb-3 text-2xl font-semibold leading-6 text-gray-900 [text-wrap:balance]">{heading}</h3>
          {description && <p className="mt-1 text-sm text-gray-500 [text-wrap:balance]">{description}</p>}
        </div>
        <div className="mt-3 shrink-0 sm:ml-3 sm:mt-0">{children}</div>
      </div>
      {tabs?.length && (
        <div className="mt-3 sm:mt-4">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, tabIdx) => (
              <Link
                key={tabIdx}
                href={tab.href}
                className={cn(
                  pathname.startsWith(tab.href)
                    ? 'border-indigo-500 text-indigo-600'
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
