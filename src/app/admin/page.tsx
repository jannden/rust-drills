'use server'

import React from 'react'
import { redirect } from 'next/navigation'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'

import Heading from '@/components/Heading'
import ToggleAdminForm from './ToggleAdminForm'

export default async function AdminPage() {
  const user = await getClerkWithDb()
  if (!user || (user.db.role !== 'ADMIN' && user.db.email !== process.env.ADMIN_EMAIL)) {
    redirect(`/sign-up`)
  }

  return (
    <>
      <Heading heading="Admin Actions" />
      <div className="flex flex-col gap-6">
        <ToggleAdminForm isAdmin={user.db.role === 'ADMIN'} />
      </div>
    </>
  )
}
