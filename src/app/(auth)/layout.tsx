import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserButton afterSignOutUrl="/" />

      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/ssr">SSR</Link>
        </li>
        <li>
          <Link href="/csr">CSR</Link>
        </li>
        <li>
          <Link href="/api/auth">API Route</Link>
        </li>
      </ul>
      {children}
    </>
  )
}
