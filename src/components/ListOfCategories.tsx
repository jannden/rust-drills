import Link from 'next/link'

import { categories } from '@/lib/config/content'

export default function ListOfCategories() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <div
          key={category.slug}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="shrink-0">
            <category.icon />
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/categories/${category.slug}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{category.title}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
