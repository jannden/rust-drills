'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { env } from '@/env.mjs'
import { defaultAI } from '@/lib/config/ai'
import { MessageData } from './page'
import { getEnergy } from '@/lib/server/getEnergy'
import { encode } from 'gpt-tokenizer'

export async function startThread(formData: FormData) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/sign-up')
  }

  const energyData = await getEnergy(user.db.id)
  if (!energyData) {
    return { ok: false, message: 'No energy data' }
  }
  if (energyData.energy < defaultAI.maxTokens.default) {
    return { ok: false, message: 'Missing energy' }
  }

  const memoryId = formData.get('memoryId') as string
  if (!memoryId) {
    return { ok: false, message: 'Story Progress ID is missing' }
  }

  const memory = await prisma.memory.findUnique({
    where: {
      id: memoryId,
      userId: user.db.id,
    },
    include: {
      snippet: true,
    },
  })
  if (!memory) {
    return { ok: false, message: 'Memory not found' }
  }

  const initialMessages = [
    {
      role: 'user' as const,
      content: `Hello!`,
      metadata: { hidden: true },
    },
    {
      role: 'user' as const,
      content: `World!`,
      metadata: { hidden: true },
    },
  ]

  const messageThread = await openai.beta.threads.create({
    metadata: {
      userId: user.db.id,
      memoryId: memory.id,
    },
    messages: initialMessages,
  })
  if (!messageThread.id) {
    return { ok: false, message: 'Error creating thread' }
  }

  await prisma.memory.update({
    where: {
      id: memory.id,
    },
    data: {
      openaiThreadId: messageThread.id,
    },
  })

  const prompt = await prisma.prompt.create({
    data: {
      userId: user.db.id,
      maxTokens: defaultAI.maxTokens.default,
      type: 'assistant',
      prompt: initialMessages,
      memoryId: memory.id,
      openaiThreadId: messageThread.id,
      openaiAssistantId: env.OPENAI_ASSISTANT_ID,
    },
  })

  let run = await openai.beta.threads.runs.create(messageThread.id, {
    assistant_id: env.OPENAI_ASSISTANT_ID,
  })

  while (run.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 250))
    run = await openai.beta.threads.runs.retrieve(messageThread.id, run.id)
  }

  const messages = await openai.beta.threads.messages.list(messageThread.id)
  const messagesData = messages.data as MessageData[]
  const lastMessage = messagesData.sort((a, b) => b.created_at - a.created_at)[0]
  const completion =
    lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text'
      ? lastMessage.content[0].text.value
      : 'unknown'

  if (run.usage?.total_tokens) {
    await prisma.prompt.update({
      where: {
        id: prompt.id,
      },
      data: {
        model: run.model,
        openaiRunId: run.id,
        promptTokens: run.usage.prompt_tokens,
        completionTokens: run.usage.completion_tokens,
        completion,
      },
    })
  }

  revalidatePath('/articles')
  return { ok: true, message: null }
}

export async function sendMessage(prevState: any, formData: FormData) {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/sign-up')
  }

  const energyData = await getEnergy(user.db.id)
  if (!energyData) {
    return { ok: false, message: 'No energy data' }
  }

  const comment = formData.get('comment') as string
  const memoryId = formData.get('memoryId') as string
  if (!memoryId) {
    return { ok: false, message: 'Story Progress ID is missing' }
  }
  const hidden = Boolean(formData.get('hidden'))
  if (!comment) {
    return { ok: false, message: 'Comment is missing' }
  }

  const maxTokens = defaultAI.maxTokens.default
  const promptTokens = encode(JSON.stringify(comment)).length ?? 0
  if (energyData.energy < maxTokens + promptTokens) {
    return { ok: false, message: 'Not enough energy' }
  }

  const thread = await prisma.memory.findUnique({
    where: { id: memoryId, userId: user.db.id },
  })
  if (!thread?.openaiThreadId) {
    return { ok: false, message: 'Thread not found' }
  }

  const threadMessages = await openai.beta.threads.messages.create(thread.openaiThreadId, {
    role: 'user',
    content: comment,
    ...(hidden ? { metadata: { hidden: true } } : {}),
  })

  const prompt = await prisma.prompt.create({
    data: {
      userId: user.db.id,
      maxTokens,
      type: 'assistant',
      prompt: [comment],
      memoryId: thread.id,
      openaiThreadId: threadMessages.thread_id,
      openaiAssistantId: env.OPENAI_ASSISTANT_ID,
    },
  })

  let run = await openai.beta.threads.runs.create(thread.openaiThreadId, {
    assistant_id: env.OPENAI_ASSISTANT_ID,
  })

  while (run.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 500))
    run = await openai.beta.threads.runs.retrieve(thread.openaiThreadId, run.id)
  }

  const messages = await openai.beta.threads.messages.list(threadMessages.thread_id)
  const messagesData = messages.data as MessageData[]
  const lastMessage = messagesData.sort((a, b) => b.created_at - a.created_at)[0]
  const completion =
    lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text'
      ? lastMessage.content[0].text.value
      : 'unknown'

  if (run.usage?.total_tokens) {
    await prisma.prompt.update({
      where: {
        id: prompt.id,
      },
      data: {
        model: run.model,
        openaiRunId: run.id,
        promptTokens: run.usage.prompt_tokens,
        completionTokens: run.usage.completion_tokens,
        completion,
      },
    })
  }

  revalidatePath('/articles')
  return { ok: true, message: null }
}
