'use client'

import { usePathname } from 'next/navigation'
import { Book, BookOpen, Bookmark, BarChart2, User } from 'lucide-react'

import { NavType } from '@/lib/config/global'
import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'

const Icon = ({ icon, className }: { icon: string; className: ClassValue }) => {
  switch (icon) {
    case 'Dashboard':
      return <BarChart2 aria-hidden="true" className={cn(className)} />
    case 'Book':
      return <Book aria-hidden="true" className={cn(className)} />
    case 'Bookmark':
      return <Bookmark aria-hidden="true" className={cn(className)} />
    case 'BookOpen':
      return <BookOpen aria-hidden="true" className={cn(className)} />
    case 'User':
      return <User aria-hidden="true" className={cn(className)} />
    default:
      return null
  }
}

export default function NavLink({ item }: { item: NavType }) {
  const pathname = usePathname()
  return (
    <a
      href={item.href}
      className={cn(
        item.activePathnames.some((path) => pathname.slice(3).startsWith(path))
          ? 'bg-gray-50 text-indigo-600'
          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
        'group flex gap-x-3 rounded-md py-3 pl-2 pr-3 text-sm font-semibold leading-6'
      )}
    >
      <Icon
        icon={item.icon}
        className={cn(
          item.activePathnames.some((path) => pathname.slice(3).startsWith(path))
            ? 'text-indigo-600'
            : 'text-gray-400 group-hover:text-indigo-600',
          'size-6 shrink-0'
        )}
      />
      {item.name}
    </a>
  )
}
