'use client'

import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { User } from 'lucide-react'
import Link from 'next/link'

export default function UserAvatar() {
  const { isLoaded, isSignedIn, user } = useUser()
  if (!isLoaded || !isSignedIn) {
    return null
  }

  const name = user.firstName || 'Profile'
  const image = user.imageUrl

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
    <Link href="/settings" className="rounded-full border-4 border-transparent transition hover:border-indigo-300">
      {icon}
    </Link>
  )
}
