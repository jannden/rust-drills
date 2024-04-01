'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'
import { User } from 'lucide-react'

export default function UserAvatar() {
  const { isLoaded, isSignedIn, user } = useUser()
  if (!isLoaded) {
    return null
  }

  const name = user?.firstName || 'Profile'
  const image = user?.imageUrl

  const icon = !!image ? (
    <div className="relative flex size-7 shrink-0 overflow-hidden rounded-full">
      <Image src={image} alt={name} layout="fill" objectFit="cover" />
    </div>
  ) : (
    <>
      <span className="sr-only">{name}</span>
      <User aria-hidden="true" className="bg-muted size-7 rounded-full" />
    </>
  )

  return (
    <>
      <SignedIn>
        <Link
          href="/settings"
          className="cursor-pointer rounded-full border-4 border-transparent transition hover:border-indigo-300"
        >
          {icon}
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <div className="bg-muted cursor-pointer rounded-full border-4 border-transparent p-1 transition hover:border-indigo-300">
            <span className="sr-only">Sign In</span>
            <User aria-hidden="true" className="size-4 rounded-full" />
          </div>
        </SignInButton>
      </SignedOut>
    </>
  )
}
