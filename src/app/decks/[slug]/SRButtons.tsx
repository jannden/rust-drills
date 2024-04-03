'use client'

import { MemoryPUTRequestType, MemoryPUTResponseType } from '@/app/api/memories/validations'
import Button, { ButtonVariant, ButtonType } from '@/components/Button'
import ModalLogin from '@/components/ModalLogin'
import { formatDate } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { DateTime } from 'luxon'
import { useState } from 'react'

export default function SRButtons({
  snippetId,
  dateTimePlanned,
}: {
  snippetId: string
  dateTimePlanned: string | null
}) {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<string | null>(dateTimePlanned)

  const handleSave = async (numberOfMistakes: number) => {
    setLoading(true)

    const reqBody: MemoryPUTRequestType = {
      snippetId,
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

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="inline size-6 animate-spin" />
      </div>
    )
  }

  const isScheduled = scheduledDate && DateTime.fromISO(scheduledDate) > DateTime.now()
  const isOverdue = scheduledDate && DateTime.fromISO(scheduledDate) < DateTime.now()

  if (isScheduled) {
    return (
      <div className="rounded bg-stone-100 px-3 py-2 text-center">
        <p className="text-sm text-slate-600">Repeat at:</p>
        <p className="text-sm text-slate-600">{formatDate(scheduledDate).hours}</p>
        <p className="text-sm text-slate-600">{formatDate(scheduledDate).days}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-row flex-wrap gap-6 lg:flex-col">
      {isOverdue && (
        <div className="rounded bg-orange-100 px-3 py-2 text-center">
          <p className="text-sm text-orange-600">Is overdue for repetition.</p>
        </div>
      )}

      {user ? (
        <Button
          variant={ButtonVariant.Secondary}
          type={ButtonType.Button}
          onClick={() => handleSave(0)}
          disabled={loading}
        >
          Easy
        </Button>
      ) : (
        <ModalLogin buttonVariant={ButtonVariant.Secondary} buttonType={ButtonType.Button}>
          Easy
        </ModalLogin>
      )}
      {user ? (
        <Button
          variant={ButtonVariant.Secondary}
          type={ButtonType.Button}
          onClick={() => handleSave(1)}
          disabled={loading}
          className="flex items-center justify-center gap-3"
        >
          Difficult
        </Button>
      ) : (
        <ModalLogin buttonVariant={ButtonVariant.Secondary} buttonType={ButtonType.Button}>
          Difficult
        </ModalLogin>
      )}
    </div>
  )
}
