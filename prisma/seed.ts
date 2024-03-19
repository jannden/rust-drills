import { PrismaClient } from '@prisma/client'

import articles from './data/articles.json'

const prisma = new PrismaClient()

export async function update() {
  console.log('Updating from JSON...')
  for (const a of articles) {
    // Match article by url
    const article = await prisma.article.findFirst({
      where: { url: a.url },
      include: { snippets: true },
    })
    if (article) {
      console.log(`Updating article ${article.title}${article.title !== a.title ? ` (${a.title})` : ''}...`)
      await prisma.article.update({
        where: { id: article.id },
        data: {
          ...a,
          snippets: undefined,
        },
      })
      console.log(`Updating snippets for this article...`)
      for (const s of a.snippets) {
        // Match snippet by order
        const snippet = article.snippets.find((sn) => sn.order === s.order)
        if (snippet) {
          console.log(`Updating snippet ${snippet.order}...`)
          await prisma.snippet.update({
            where: { id: snippet.id },
            data: s,
          })
        } else {
          console.log(`Creating snippet ${s.order}...`)
          await prisma.snippet.create({
            data: {
              ...s,
              article: { connect: { id: article.id } },
            },
          })
        }
      }
    } else {
      console.log(`Creating article ${a.title}...`)
      await prisma.article.create({
        data: {
          ...a,
          snippets: {
            create: a.snippets.map((s, index) => ({
              ...s,
            })),
          },
        },
      })
    }
  }
}

export async function reset() {
  console.log('Resetting articles and snippets...')
  await prisma.article.deleteMany()
  await prisma.snippet.deleteMany()
  await prisma.memory.deleteMany()
  for (const a of articles) {
    const article = await prisma.article.create({
      data: {
        ...a,
        snippets: {
          create: a.snippets.map((s) => ({
            ...s,
          })),
        },
      },
    })
    console.log(`Created article ${article.title}.`)
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
