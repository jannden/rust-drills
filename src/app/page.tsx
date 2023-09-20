import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <Link href="/sign-in">Sign in</Link>
    </div>
  )
}
