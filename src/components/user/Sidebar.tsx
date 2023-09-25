import NavLink from '@/components/user/NavLink'
import { env } from '@/env.mjs'
import { navigation } from '@/lib/config/global'

export default async function Sidebar() {
  const year = new Date().getFullYear()

  return (
    <aside className="hidden h-full shrink-0 grow-0 flex-col overflow-x-auto pb-3 pt-10 md:flex md:basis-48 lg:basis-64">
      <nav className="block flex-1 p-3 sm:px-6 md:px-0">
        <ul role="list" className="flex flex-wrap justify-center gap-x-6 gap-y-1 whitespace-nowrap md:flex-col">
          {navigation.map((item) => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>
      <div className="hidden text-gray-500 md:block md:text-xs lg:text-sm">
        {`${env.NEXT_PUBLIC_APP_NAME} © ${year}`}
        <br />
        All rights reserved.
      </div>
    </aside>
  )
}
