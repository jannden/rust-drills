import fs from 'fs'
import path from 'path'
import { categories } from '../config/content'
import { ContentVariant } from '../types'

export const getSnippetBySlugs = async (deckSlug: string, snippetSlug: string) => {
  const allDecks = categories.flatMap((category) => category.decks)
  const allSnippetsWithDeckSlug = allDecks.flatMap((deck) =>
    deck.snippets.map((snippet) => ({ heading: snippet.heading, snippetSlug: snippet.slug, deckSlug: deck.slug }))
  )
  const snippet = allSnippetsWithDeckSlug.find(
    (snippet) => snippet.deckSlug === deckSlug && snippet.snippetSlug === snippetSlug
  )
  return snippet
}

export async function loadMdx(deckSlug: string, snippetSlug: string, variant: ContentVariant) {
  let content = ''

  try {
    const markdownFilePath = path.join(process.cwd(), 'src', 'mdx', deckSlug, snippetSlug, `${variant}.mdx`)
    content = fs.readFileSync(markdownFilePath, 'utf-8')
  } catch (e) {
    console.error(e)
  }

  return content
}
