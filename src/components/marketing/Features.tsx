import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/marketing/Container'

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="features-title"
            className="font-display text-4xl font-medium tracking-tighter text-blue-600 [text-wrap:balance] sm:text-5xl"
          >
            Learning
          </h2>
          <p className="font-display mt-4 text-2xl tracking-tight text-blue-900 [text-wrap:balance]">
            Master new vocabulary with smart spaced repetition, then bring words to life in captivating AI-crafted
            stories.
          </p>
        </div>
        <ul className="mx-auto mt-14 max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-2 lg:place-content-center lg:gap-8">
          <li className="mt-3 flex max-w-2xl lg:mx-0">
            <div className="w-28 px-4 text-5xl font-extralight text-blue-600">01.</div>
            <div>
              <div className="text-2xl font-semibold text-blue-800">Words</div>
              <p className="max-w-xs py-2 text-base tracking-tight text-blue-900">
                Vocabulary is the foundation of language. Learn new words with spaced repetition in dynamic exercises.
              </p>
            </div>
          </li>
          <li className="mt-3 flex max-w-2xl lg:mx-0">
            <div className="w-28 px-4 text-5xl font-extralight text-blue-600">02.</div>
            <div>
              <div className="text-2xl font-semibold text-blue-800">Phrases</div>
              <p className="max-w-xs py-2 text-base tracking-tight text-blue-900">
                Phrases are the building blocks of language. Discover new phrases based on your vocabulary with our
                AI-powered algorithm.
              </p>
            </div>
          </li>
          <li className="mt-3 flex max-w-2xl lg:mx-0">
            <div className="w-28 px-4 text-5xl font-extralight text-blue-600">03.</div>
            <div>
              <div className="text-2xl font-semibold text-blue-800">Stories</div>
              <p className="max-w-xs py-2 text-base tracking-tight text-blue-900">
                Stories are the heart of language. Bring your vocabulary to life in captivating AI-crafted dialogues.
              </p>
            </div>
          </li>
          <li className="mt-3 flex max-w-2xl lg:mx-0">
            <div className="w-28 px-4 text-5xl font-extralight text-blue-600">04.</div>
            <div>
              <div className="text-2xl font-semibold text-blue-800">Chat</div>
              <p className="max-w-xs py-2 text-base tracking-tight text-blue-900">
                Talking is the soul of language. Practice your speaking skills with our AI-powered chatbot that adjusts
                to your level.
              </p>
            </div>
          </li>
        </ul>
      </Container>
    </section>
  )
}
