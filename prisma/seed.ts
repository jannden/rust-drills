import { PrismaClient } from '@prisma/client'

import { reset } from './seedScripts'

const prisma = new PrismaClient()

reset()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
