import { PrismaClient } from '@prisma/client'

import decks from './data/decks.json'

const prisma = new PrismaClient()

export async function update() {
  console.log('Updating from JSON...')
  for (const deck of decks) {
    // Match deck by url
    const foundDeck = await prisma.deck.findFirst({
      where: { url: deck.url },
      include: { snippets: true },
    })
    if (foundDeck) {
      console.log(`Updating deck ${deck.title}${deck.title !== deck.title ? ` (${foundDeck.title})` : ''}...`)
      await prisma.deck.update({
        where: { id: foundDeck.id },
        data: {
          ...deck,
          snippets: undefined,
        },
      })
      console.log(`Updating snippets for this deck...`)
      for (const snippet of deck.snippets) {
        // Match snippet by order
        const foundSnippet = deck.snippets.find((sn) => sn.order === snippet.order)
        if (foundSnippet) {
          console.log(`Updating snippet ${snippet.order}...`)
          await prisma.snippet.updateMany({
            where: { order: foundSnippet.order },
            data: snippet,
          })
        } else {
          console.log(`Creating snippet ${snippet.order}...`)
          await prisma.snippet.create({
            data: {
              ...snippet,
              deck: { connect: { id: foundDeck.id } },
            },
          })
        }
      }
    } else {
      console.log(`Creating deck ${deck.title}...`)
      await prisma.deck.create({
        data: {
          ...deck,
          snippets: {
            create: deck.snippets.map((snippet, index) => ({
              ...snippet,
            })),
          },
        },
      })
    }
  }
}

export async function reset() {
  console.log('Resetting decks and snippets...')
  await prisma.deck.deleteMany()
  await prisma.snippet.deleteMany()
  await prisma.memory.deleteMany()
  for (const deck of decks) {
    await prisma.deck.create({
      data: {
        ...deck,
        snippets: {
          create: deck.snippets.map((snippet) => ({
            ...snippet,
          })),
        },
      },
    })
    console.log(`Created deck ${deck.title}.`)
  }
}

reset()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
