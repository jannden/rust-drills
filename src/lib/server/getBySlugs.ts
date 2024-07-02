import fs from 'fs'
import path from 'path'
import { categories } from '../config/content'
import { ContentVariant } from '../types'

export const getAllDecks = () =>
  categories.flatMap((category) =>
    category.decks.map((deck) => ({ ...deck, categorySlug: category.slug, categoryTitle: category.title }))
  )

export const getSnippetBySlugs = async (deckSlug: string, snippetSlug: string) => {
  const allDecks = getAllDecks()
  const allSnippetsWithDeckSlug = allDecks.flatMap((deck) =>
    deck.snippets.map((snippet) => ({
      heading: snippet.heading,
      snippetSlug: snippet.slug,
      deckSlug: deck.slug,
      categorySlug: deck.categorySlug,
    }))
  )
  const snippet = allSnippetsWithDeckSlug.find(
    (snippet) => snippet.deckSlug === deckSlug && snippet.snippetSlug === snippetSlug
  )
  return snippet
}

export async function loadMdx(categorySlug: string, deckSlug: string, snippetSlug: string, variant: ContentVariant) {
  let content = ''

  try {
    const markdownFilePath = path.join(
      process.cwd(),
      'src',
      'mdx',
      categorySlug,
      deckSlug,
      snippetSlug,
      `${variant}.mdx`
    )
    content = fs.readFileSync(markdownFilePath, 'utf-8')
  } catch (e) {
    console.error(e)
  }

  return content
}
