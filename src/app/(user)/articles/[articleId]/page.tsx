'use server'

import React, { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { BookOpen, Loader2 } from 'lucide-react'

import { useMounted } from '@/lib/hooks/use-mounted'
import {
  MemoryGETResponseType,
  MemoryInfoType,
  MemoryPUTRequestType,
  MemoryPUTResponseType,
} from '@/app/api/memories/validations'
import Alert, { AlertVariant } from '@/components/user/Alert'
import Button, { ButtonVariant, ButtonType } from '@/components/user/Button'
import CircularProgress from '@/components/user/CircularProgress'
import Heading from '@/components/user/Heading'
import { prisma } from '@/lib/prisma'

type Props = {
  params: {
    articleId: string
  }
}

export default async function Article({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: {
      id: params.articleId,
    },
  })
  if (!article) {
    return <Alert message="Article not found." variant={AlertVariant.Red} />
  }

  return (
    <>
      <Heading heading={article.title} />
      <div>{article.summary}</div>
      <Button variant={ButtonVariant.Primary} type={ButtonType.Link} href={`/lesson/${article.id}`}>
        Practice
      </Button>
      <Button variant={ButtonVariant.Secondary} type={ButtonType.Link} href={article.url} target="_blank">
        Open
      </Button>
    </>
  )
}
