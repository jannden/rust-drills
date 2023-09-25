import { NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'

import { defaultAI } from '@/lib/config/ai'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { openai } from '@/lib/openai'
import { AiPOST } from './validations'
import { logError } from '@/lib/utils'
import { getEnergy } from '@/lib/server/getEnergy'
import { prisma } from '@/lib/prisma'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { encode } from 'gpt-tokenizer'
import { JsonObject } from '@prisma/client/runtime/library'

// * AI
// Note: Due to the fact that we are using Postgres to check for spent tokens
// instead of Redis, we can't use Edge Functions for this route at the moment.
export async function POST(req: Request) {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json()
  const body = AiPOST.safeParse(reqBody)
  if (!body.success) {
    const publicErrorMessage = 'Invalid request'
    logError(publicErrorMessage, body.error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 400 })
  }

  if (!body.data.prompt && !body.data.messages) {
    return NextResponse.json({ error: 'Prompt or messages are required' }, { status: 400 })
  }

  let promptId = body.data.promptId
  let promptContent: ChatCompletionMessageParam[] = []
  const model = body.data.model ?? defaultAI.model
  const maxTokens = body.data.maxTokens
  const temperature = body.data.temperature ?? defaultAI.temperature
  const energyData = await getEnergy(user.db.id)

  if (!energyData) {
    return NextResponse.json({ error: 'No energy data' }, { status: 400 })
  }

  let createNewPrompt = true
  if (promptId) {
    console.log('PromptId ->', promptId)
    // Get the promptContent from the DB if we have promptId from the request
    // This way we are able to hide the prompt from the frontend
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: promptId,
        userId: user.db.id,
      },
    })
    if (prompt?.prompt) {
      if (typeof prompt.prompt === 'object' && Array.isArray(prompt.prompt)) {
        promptContent = prompt.prompt.map((p) => {
          const message = p as JsonObject
          const chatCompletionMessage = {
            role: message.role,
            content: message.content,
          }
          return chatCompletionMessage as ChatCompletionMessageParam
        })

        createNewPrompt = prompt.completionTokens === null ? false : true
      }
    }
  }

  if (body.data.messages) {
    promptContent = [...promptContent, ...body.data.messages]
  }

  if (body.data.prompt) {
    promptContent = [...promptContent, { role: 'user', content: body.data.prompt }]
  }

  const promptTokens = encode(JSON.stringify(promptContent)).length ?? 0
  if (energyData.energy < maxTokens + promptTokens) {
    return NextResponse.json({ error: 'Not enough energy' }, { status: 400 })
  }

  try {
    if (createNewPrompt) {
      const prompt = await prisma.prompt.create({
        data: {
          type: body.data.promptType,
          model,
          prompt: promptContent.map((p) => {
            const chatCompletionMessage = {
              role: p.role,
              content: p.content,
            }
            return chatCompletionMessage as JsonObject
          }),
          promptTokens,
          temperature: temperature,
          userId: user.db.id,
          maxTokens: maxTokens,
          memoryId: body.data.threadId,
        },
      })
      promptId = prompt.id
    } else {
      await prisma.prompt.update({
        where: {
          id: promptId,
        },
        data: {
          type: body.data.promptType,
          model,
          prompt: promptContent.map((p) => {
            const chatCompletionMessage = {
              role: p.role,
              content: p.content,
            }
            return chatCompletionMessage as JsonObject
          }),
          promptTokens,
          temperature: temperature,
          userId: user.db.id,
          maxTokens: maxTokens,
          memoryId: body.data.threadId,
        },
      })
    }
  } catch (error) {
    const publicErrorMessage = 'Internal server error'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  if (!promptId) {
    const publicErrorMessage = 'Internal server error'
    console.error(publicErrorMessage, 'Prompt does not exist')
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }

  // Streaming response
  if (body.data.stream) {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      temperature,
      max_tokens: maxTokens,
      messages: promptContent,
      response_format: {
        type: body.data.responseType ?? 'text',
      },
    })

    const responseStream = OpenAIStream(response, {
      async onCompletion(completion) {
        const completionTokens = encode(completion).length
        await prisma.prompt.update({
          where: {
            id: promptId,
          },
          data: {
            completion: completion,
            completionTokens: completionTokens,
          },
        })
      },
    })

    return new StreamingTextResponse(responseStream, {})
  }

  // Await response
  try {
    const response = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: promptContent,
    })

    const completionText = response.choices[0].message.content
    const completionTokens = response.usage?.completion_tokens
    const promptTokens = response.usage?.prompt_tokens

    await prisma.prompt.update({
      where: {
        id: promptId,
      },
      data: {
        completion: completionText,
        completionTokens: completionTokens,
        promptTokens: promptTokens,
      },
    })

    return NextResponse.json({ completionText, promptId })
  } catch (error) {
    const publicErrorMessage = 'Internal server error'
    logError(publicErrorMessage, error)
    return NextResponse.json({ error: publicErrorMessage }, { status: 500 })
  }
}
