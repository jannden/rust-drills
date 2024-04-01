import Image from 'next/image'

import logoSvg from '@/images/logo.svg'
import { env } from '@/env.mjs'

export default function Logo() {
  return (
    <div className="flex items-center gap-x-3">
      <Image src={logoSvg} alt={`Logo of ${env.NEXT_PUBLIC_APP_NAME}`} aria-hidden="true" height={30} width={30} />
      <div className="text-xl font-bold">{env.NEXT_PUBLIC_APP_NAME}</div>
    </div>
  )
}
