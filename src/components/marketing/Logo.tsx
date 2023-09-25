import Image from 'next/image'

import logoSvg from '@/images/logo.svg'
import { env } from '@/env.mjs'

export function Logo() {
  return (
    <div className="flex items-center gap-x-4 text-blue-600">
      <Image src={logoSvg} alt={`Logo of ${env.NEXT_PUBLIC_APP_NAME}`} aria-hidden="true" height={50} width={50} />
      <div className="text-3xl font-bold">{env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
  )
}
