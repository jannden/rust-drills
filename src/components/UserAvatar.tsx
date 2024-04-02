'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, ClerkLoading, useUser, ClerkLoaded } from '@clerk/nextjs'
import { Hourglass, User } from 'lucide-react'

export default function UserAvatar() {
  const { user, isLoaded } = useUser()

  const name = user?.firstName || 'Profile'
  const image = user?.imageUrl

  if (!isLoaded) {
    return null
  }

  const userImage = (
    <div className="p-2">
      <span className="sr-only">Sign In</span>
      <User aria-hidden="true" className="size-4" />
    </div>
  )

  const icon = !!image ? (
    <div className="relative flex size-7 shrink-0 overflow-hidden rounded-full">
      <Image src={image} alt={name} width={40} height={40} />
    </div>
  ) : (
    userImage
  )

  return (
    <>
      <ClerkLoading>
        <div className="animate-pulse cursor-pointer rounded-full border-2 border-transparent bg-stone-100">
          <div className="p-2">
            <span className="sr-only">Loading</span>
            <Hourglass aria-hidden="true" className="size-4 stroke-stone-300 transition" />
          </div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="cursor-pointer rounded-full border-2 border-transparent bg-stone-100 transition hover:border-orange-700 hover:text-orange-700">
          <SignedIn>
            <Link href="/settings">{icon}</Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">{userImage}</SignInButton>
          </SignedOut>
        </div>
      </ClerkLoaded>
    </>
  )
}
