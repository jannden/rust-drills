import { PrismaClient } from '@prisma/client'

import articles from './data/articles.json'

const prisma = new PrismaClient()

export async function seed() {
  console.log('Seeding topics and snippets...')
  await prisma.article.deleteMany()
  await prisma.snippet.deleteMany()
  await prisma.memory.deleteMany()
  for (const a of articles) {
    const article = await prisma.article.create({
      data: {
        order: a.order,
        title: a.title,
        subtitle: a.subtitle,
        url: a.url,
        snippets: {
          create: a.snippets.map((s, index) => ({
            ...s,
            content: s.content.replaceAll('\\"', '"'),
            task: s.task.replaceAll('\\"', '"'),
            order: index + 1,
          })),
        },
      },
    })
    console.log(`Created article ${article.title}.`)
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
