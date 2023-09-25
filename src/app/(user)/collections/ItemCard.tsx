import Tooltip from '@/components/user/Tooltip'
import { CardDetails, MemoryStrength } from '@/lib/types'
import { Scroll } from 'lucide-react'

export default async function ItemCard({ cardDetails }: { cardDetails: CardDetails }) {
  return (
    <li key={cardDetails.memoryId} className="rounded-lg bg-white p-6 shadow">
      <div className="flex w-full justify-between">
        <div className="flex flex-1 items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{cardDetails.memoryId}</p>
            <p className="mt-1 text-sm text-gray-500">{cardDetails.snippetId}</p>
          </div>
          <div className="mt-1">
            <span className="sr-only">Memory Strength: {cardDetails.memoryStrength}</span>
            <Tooltip text="Repeat soon">
              {cardDetails.memoryStrength === MemoryStrength.Strong ? (
                <span className="inline-flex size-3 rounded-full bg-emerald-200" />
              ) : cardDetails.memoryStrength === MemoryStrength.Medium ? (
                <span className="inline-flex size-3 rounded-full bg-indigo-200" />
              ) : (
                <div className="relative flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-200 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-red-300" />
                </div>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="mt-6 flex w-full items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-6 text-gray-400">
            <Tooltip text="Memory Strength">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Scroll className="size-4" aria-hidden="true" />
                <span className="sr-only">Memory Strength</span>
                <span>{cardDetails.memoryStrength}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </li>
  )
}
