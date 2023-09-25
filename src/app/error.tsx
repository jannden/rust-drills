'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  const handleReset = () => {
    reset()
    router.refresh()
  }

  return (
    <div className="size-full text-center">
      <h2 className="my-6 text-xl">Something went wrong!</h2>
      <p>See the console log for more details.</p>
      <button onClick={handleReset} className="mt-6 rounded-sm border bg-slate-100 px-2 py-1 shadow">
        Try to refresh
      </button>
    </div>
  )
}
