import Image from 'next/image'

import { Button } from '@/components/marketing/Button'
import { Container } from '@/components/marketing/Container'
import backgroundImage from '@/images/background-newsletter.jpg'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { env } from '@/env.mjs'

function ArrowRightIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path
        d="m14 7 5 5-5 5M19 12H5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CTA() {
  return (
    <section id="cta" aria-label="Call to action">
      <Container>
        <div className="md:rounded-5xl relative -mx-4 overflow-hidden bg-indigo-50 px-4 py-20 sm:-mx-6 sm:px-6 md:mx-0 md:px-16 xl:px-24 xl:py-36">
          <Image
            className="absolute left-1/2 top-0 translate-x-[-10%] translate-y-[-45%] lg:translate-x-[-32%]"
            src={backgroundImage}
            alt=""
            width={919}
            height={1351}
            unoptimized
          />
          <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-x-32 gap-y-14 xl:max-w-none xl:grid-cols-2">
            <div>
              <p className="font-display text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
                Sign in now
              </p>
              <p className="mt-4 text-lg tracking-tight text-blue-900">Enhance your Rustacean journey.</p>
            </div>
            <div className="flex items-center justify-end">
              <SignedIn>
                <Button href={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}>Start</Button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
