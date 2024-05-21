import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex justify-center pt-24">
      <Loader2 className="size-10 animate-spin text-slate-200" />
    </div>
  )
}
