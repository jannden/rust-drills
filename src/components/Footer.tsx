import { env } from '@/env.mjs'
import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-8 md:px-6 lg:px-8">
        <div className="text-sm text-gray-500">
          <span className="block sm:inline">
            &copy; {year} {env.NEXT_PUBLIC_APP_NAME}. Created by{' '}
            <Link href={env.NEXT_PUBLIC_AUTHOR_URL}>{env.NEXT_PUBLIC_AUTHOR_NAME}</Link>.
          </span>{' '}
          <span className="block sm:inline">All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
