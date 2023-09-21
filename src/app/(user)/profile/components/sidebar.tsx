'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import React from 'react'
import { Icons } from '@/components/icons'
import { LucideIcon } from 'lucide-react'
import { SidebarConfig } from '@/lib/types'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  nav: SidebarConfig[]
}

export function Sidebar({ nav, className, ...props }: SidebarProps) {
  const path = usePathname()

  if (!nav?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {nav.map((s) => (
        <div key={s.section} className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{s.section}</h2>
            <div className="space-y-1">
              {s.items.map((item, index) => {
                const Icon = Icons[item.icon || 'arrowRight']
                return (
                  item.href && (
                    <Link key={index} href={item.disabled ? '#' : item.href}>
                      <span
                        className={cn(
                          'group flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                          path === item.href ? 'bg-accent' : 'transparent',
                          item.disabled && 'cursor-not-allowed opacity-40'
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  )
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
