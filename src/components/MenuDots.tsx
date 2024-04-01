import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MenuDots() {
  return (
    <div className="flex shrink-0 self-center">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <MoreVertical className="size-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="ring-opacity/5 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex px-4 py-2 text-sm')}
                  >
                    <MoreVertical className="mr-3 size-5 text-gray-400" aria-hidden="true" />
                    <span>Add to favorites</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex px-4 py-2 text-sm')}
                  >
                    <MoreVertical className="mr-3 size-5 text-gray-400" aria-hidden="true" />
                    <span>Embed</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex px-4 py-2 text-sm')}
                  >
                    <MoreVertical className="mr-3 size-5 text-gray-400" aria-hidden="true" />
                    <span>Report content</span>
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
