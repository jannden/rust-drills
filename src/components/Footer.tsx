import { env } from '@/env.mjs'
import Link from 'next/link'

export default async function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="mx-auto max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="sm:border-t border-gray-200 py-2 sm:py-8 text-center text-xs sm:text-sm text-gray-500 sm:text-left">
          &copy; {year} <Link href={env.NEXT_PUBLIC_AUTHOR_URL}>{env.NEXT_PUBLIC_AUTHOR_NAME}</Link>. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}