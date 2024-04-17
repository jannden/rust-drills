import { SignedOut, SignInButton } from '@clerk/nextjs'

import Button, { ButtonVariant, ButtonType } from './Button'

export default function WelcomeMessage() {
  return (
    <div className="mb-6 rounded-2xl bg-stone-50 p-6 md:flex md:items-center md:justify-between">
      <div>
        <p>
          Welcome to Rust Drills - a collection of guides and exercises to help you learn Rust. You can explore it
          freely.
        </p>
        <SignedOut>
          <p>If you want more, log in and take advantage of spaced repetition and AI-assisted practice.</p>
        </SignedOut>
      </div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant={ButtonVariant.Primary} type={ButtonType.Button} className="mt-6 md:mt-0">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}
