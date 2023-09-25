import { Button } from '@/components/marketing/Button'
import { Container } from '@/components/marketing/Container'
import { Logo } from '@/components/marketing/Logo'
import { env } from '@/env.mjs'
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="relative z-50 flex-none lg:pt-11">
      <Container className="flex flex-wrap items-center justify-between lg:flex-nowrap">
        <div className="mt-10 lg:mt-0 lg:grow lg:basis-0">
          <Logo />
        </div>
        <div className="order-first -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap border-b border-blue-600/10 py-4 font-mono text-sm text-blue-600 sm:-mx-6 lg:order-none lg:mx-0 lg:basis-auto lg:border-0 lg:py-0">
          <div className="mx-auto flex items-center gap-4 px-4">
            <p>Limited Spots for Beta Testing</p>
          </div>
        </div>
        <div className="mt-10 lg:mt-0 lg:flex lg:grow lg:basis-0 lg:justify-end">
          <SignedIn>
            <Button href={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}>Start</Button>
          </SignedIn>
          <SignedOut>
            <Button href="/sign-in">Sign In</Button>
          </SignedOut>
        </div>
      </Container>
    </header>
  )
}
