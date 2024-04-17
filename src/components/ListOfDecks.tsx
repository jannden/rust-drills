import Image, { StaticImageData } from 'next/image'

type Deck = {
  imageUrl: StaticImageData
  id: string
  order: number
  isVisible: boolean
  title: string
  subtitle: string
  url: string
  canonicalUrl: string
  slug: string
  categoryTitle: string
  categorySlug: string
} | null

export default function ListOfDecks({ decks }: { decks: Deck[] }) {
  return (
    <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:mx-0 lg:grid-cols-3 xl:grid-cols-4">
      {decks.map(
        (deck) =>
          deck && (
            <article key={deck.id} className="group relative flex flex-col items-start justify-between">
              <div className="xs:aspect-[32/9] relative aspect-[16/9] w-full sm:aspect-[16/9]">
                <Image
                  src={deck.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="rounded-2xl object-cover group-hover:shadow-xl"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 15vw"
                />
              </div>
              <div className="mt-6 max-w-xl">
                <a
                  href={`/decks/${deck.slug}`}
                  className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-orange-600"
                >
                  <span className="absolute inset-0" />
                  {deck.title}
                </a>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{deck.subtitle}</p>
              </div>
            </article>
          )
      )}
    </div>
  )
}
