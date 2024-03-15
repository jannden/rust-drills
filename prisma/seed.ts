import { PrismaClient } from '@prisma/client'

import articles from './data/articles.json'

const prisma = new PrismaClient()

export async function update() {
  console.log('Updating articles and snippets...')
  for (const a of articles) {
    const article = await prisma.article.findFirst({
      where: { url: a.url },
      include: { snippets: true },
    })
    if (article) {
      console.log(`Updating article ${article.title}...`)
      for (const s of a.snippets) {
        const snippet = article.snippets.find((sn) => sn.order === s.order)
        if (snippet) {
          console.log(`Updating snippet ${snippet.order}...`)
          await prisma.snippet.update({
            where: { id: snippet.id },
            data: {
              heading: s.heading,
              content: s.content.replaceAll('\\"', '"'),
              task: s.task.replaceAll('\\"', '"'),
            },
          })
        } else {
          console.log(`Creating snippet ${s.order}...`)
          await prisma.snippet.create({
            data: {
              order: s.order,
              heading: s.heading,
              content: s.content.replaceAll('\\"', '"'),
              task: s.task.replaceAll('\\"', '"'),
              article: { connect: { id: article.id } },
            },
          })
        }
      }
    } else {
      console.log(`Creating article ${a.title}...`)
      await prisma.article.create({
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

reset()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
