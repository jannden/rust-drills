import { env } from '@/env.mjs'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
          <span className="block sm:inline">
            &copy; {year} {env.NEXT_PUBLIC_APP_NAME}.
          </span>{' '}
          <span className="block sm:inline">All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
