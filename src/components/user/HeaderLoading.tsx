import { Menu, Bell, LibrarySquare } from 'lucide-react'

export default function HeaderLoading() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-x-3">
          <button type="button" className="-m-3 p-3 md:hidden">
            <span className="sr-only">Open main menu</span>
            <Menu className="size-5 text-gray-900" aria-hidden="true" />
          </button>
          <LibrarySquare className="size-7 text-gray-900" aria-hidden="true" />
          <span className="font-bold">Frankie</span>
        </div>
        <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
          <div className="bg-muted h-3 w-8 animate-pulse rounded-sm" />
        </nav>
        <div className="flex flex-1 items-center justify-end gap-x-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="size-6" aria-hidden="true" />
          </button>
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your profile</span>
            <div className="bg-muted size-8 animate-pulse rounded-full" />
          </a>
        </div>
      </div>
    </header>
  )
}
