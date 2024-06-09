'use client'

import { MemoryPUTRequestType, MemoryPUTResponseType, MemoryDELETERequestType } from '@/app/api/memories/validations'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import ModalLogin from '@/components/ModalLogin'
import { formatDate } from '@/lib/utils'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { DateTime } from 'luxon'
import { useState } from 'react'

export default function SRButtons({
  deckSlug,
  snippetSlug,
  dateTimePlanned,
  defaultIsLearned,
  showPlannedDate,
}: {
  deckSlug: string
  snippetSlug: string
  dateTimePlanned: string | null
  defaultIsLearned: boolean
  showPlannedDate: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<string | null>(dateTimePlanned)
  const [isLearned, setIsLearned] = useState(defaultIsLearned)

  const handleSave = async (numberOfMistakes: number) => {
    setLoading(true)

    const reqBody: MemoryPUTRequestType = {
      deckSlug,
      snippetSlug,
      numberOfMistakes,
    }

    const result = await fetch(`/api/memories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(reqBody),
    })

    const data = (await result.json()) as MemoryPUTResponseType

    let newScheduledDate = null
    if (data.dateTimePlanned) {
      newScheduledDate = data.dateTimePlanned
    }
    setScheduledDate(newScheduledDate)
    setIsLearned(data.isLearned)

    setLoading(false)
  }

  const handleUndo = async () => {
    setLoading(true)

    const reqBody: MemoryDELETERequestType = {
      deckSlug,
      snippetSlug,
    }

    const result = await fetch(`/api/memories`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(reqBody),
    })

    setScheduledDate(null)
    setIsLearned(false)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="inline size-6 animate-spin" />
      </div>
    )
  }

  if (isLearned) {
    return (
      <div className="flex flex-row flex-wrap gap-6 lg:flex-col items-center lg:items-stretch">
        <div className="rounded bg-green-100 px-3 py-2 text-center text-xs text-green-600 uppercase">
          <p>Learned</p>
        </div>

        <Button variant={ButtonVariant.Secondary} type={ButtonType.Button} onClick={handleUndo} disabled={loading}>
          Undo
        </Button>
      </div>
    )
  }

  const isScheduled = scheduledDate && DateTime.fromISO(scheduledDate) > DateTime.now()
  const isOverdue = scheduledDate && DateTime.fromISO(scheduledDate) < DateTime.now()

  if (isScheduled) {
    return (
      <div className="rounded bg-stone-100 px-3 py-2 text-center text-xs text-slate-600 uppercase">
        <p>Repeat at</p>
        <p>{formatDate(scheduledDate).hours}</p>
        <p>{formatDate(scheduledDate).days}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-row flex-wrap gap-6 lg:flex-col items-center lg:items-stretch">
      {isOverdue && (
        <div className="rounded bg-orange-100 px-3 py-2 text-center text-xs text-orange-600">
          {showPlannedDate ? (
            <>
              <p>Overdue</p>
              <p>{formatDate(scheduledDate).hours}</p>
              <p>{formatDate(scheduledDate).days}</p>
            </>
          ) : (
            <p>Overdue</p>
          )}
        </div>
      )}

      <SignedIn>
        <Button
          variant={ButtonVariant.Secondary}
          type={ButtonType.Button}
          onClick={() => handleSave(0)}
          disabled={loading}
        >
          Easy
        </Button>
        <Button
          variant={ButtonVariant.Secondary}
          type={ButtonType.Button}
          onClick={() => handleSave(1)}
          disabled={loading}
          className="flex items-center justify-center gap-3"
        >
          Difficult
        </Button>
      </SignedIn>
      <SignedOut>
        <ModalLogin buttonVariant={ButtonVariant.Secondary} buttonType={ButtonType.Button}>
          Easy
        </ModalLogin>
        <ModalLogin buttonVariant={ButtonVariant.Secondary} buttonType={ButtonType.Button}>
          Difficult
        </ModalLogin>
      </SignedOut>
    </div>
  )
}
