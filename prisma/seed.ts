import { PrismaClient } from '@prisma/client'

import articles from './data/articles.json'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding articles and snippets...')
  await prisma.article.deleteMany()
  await prisma.snippet.deleteMany()
  for (const a of articles) {
    const article = await prisma.article.create({
      data: {
        title: a.title,
        subtitle: a.subtitle,
        summary: a.summary,
        url: a.url,
        snippets: {
          create: a.snippets,
        },
      },
    })
    console.log(`Created article ${article.title}.`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
