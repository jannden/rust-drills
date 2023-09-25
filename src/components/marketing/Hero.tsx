import { BackgroundImage } from '@/components/marketing/BackgroundImage'
import { Container } from '@/components/marketing/Container'

export function Hero() {
  return (
    <div className="relative py-20 sm:pb-24 sm:pt-36">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative flex items-end">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:pr-12">
          <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 [text-wrap:balance] sm:text-7xl">
            Learn Rust By Actually Coding
          </h1>
          <div className="font-display mt-6 space-y-6 text-2xl tracking-tight text-blue-900">
            <p>
              We selected a collection of Rust code snippets. Your task is to practice coding them. AI will help you along the way. Spaced repetition will make sure you remember what you learned.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
