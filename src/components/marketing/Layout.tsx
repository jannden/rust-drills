import { Footer } from '@/components/marketing/Footer'
import { Header } from '@/components/marketing/Header'

export function Layout({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) {
  return (
    <>
      <Header />
      <main className="flex-auto">{children}</main>
      {showFooter && <Footer />}
    </>
  )
}
