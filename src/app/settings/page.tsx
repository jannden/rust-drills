'use server'

import { redirect } from 'next/navigation'
import { DateTime } from 'luxon'

import Heading from '@/components/Heading'
import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import SignOut from './SignOut'
import Alert, { AlertVariant } from '@/components/Alert'
import Input from './NameInput'
import { pickFromObject } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'

export default async function Settings() {
  const user = await getClerkWithDb()
  if (!user) {
    redirect('/')
  }

  const isFirstTimeLogin = user.db.lastLogin === null
  const luxonCreatedAt = DateTime.fromJSDate(user.db.createdAt)
  const now = DateTime.local()
  const diff = now.diff(luxonCreatedAt)
  const createdMoreThan5MinutesAgo = diff.as('minutes') > 5

  return (
    <>
      <Heading heading="Settings" className="mb-0">
        <div className="flex gap-3">
          {user.db.role === 'ADMIN' && (
            <Button type={ButtonType.Link} variant={ButtonVariant.Primary} href="/admin">
              Admin
            </Button>
          )}
          {(!isFirstTimeLogin || createdMoreThan5MinutesAgo) && <SignOut signOutText="Sign Out" />}
        </div>
      </Heading>

      <dl className="mb-12 space-y-6 divide-y divide-gray-100 text-sm leading-6">
        <Input label="Public name" defaultValue={user.db.publicName ?? ''} placeholder="Your public name" />
      </dl>

      <Button type={ButtonType.Link} variant={ButtonVariant.Primary} href="/articles">
        Continue
      </Button>
    </>
  )
}
