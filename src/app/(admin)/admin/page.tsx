'use server'

import React from 'react'
import { redirect } from 'next/navigation'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'

import { Role } from '@prisma/client'
import SeedForm from './SeedForm'
import Heading from '@/components/user/Heading'

export default async function AdminPage() {
  const user = await getClerkWithDb()
  if (!user || user.db.role !== Role.ADMIN) {
    redirect(`/sign-up`)
  }

  return (
    <>
      <Heading heading="Admin Actions" />
      <SeedForm />
    </>
  )
}
