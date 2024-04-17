import Button, { ButtonType, ButtonVariant } from './Button'
import { cn } from '@/lib/utils'

type Category = {
  slug: string | null
  title: string | null
}

export default function ListOfCategories({ categories, activeSlug }: { categories: Category[]; activeSlug: string }) {
  return (
    <div className="mb-6 flex gap-6">
      {categories.map((category) => (
        <Button
          key={category.slug}
          variant={ButtonVariant.Text}
          type={ButtonType.Link}
          href={`/categories/${category.slug}`}
          className={cn('text-xl', category.slug !== activeSlug && 'font-normal text-gray-900')}
        >
          {category.title}
        </Button>
      ))}
    </div>
  )
}
