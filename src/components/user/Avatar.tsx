'use client'

import BoringAvatar from 'boring-avatars'

interface AvatarProps {
  seed: string
}

export default function Avatar({ seed }: AvatarProps) {
  return (
    <div className="flex size-10 items-center justify-center rounded-full">
      <BoringAvatar
        size={40}
        name={seed}
        variant="beam"
        colors={['#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b']}
      />
    </div>
  )
}
