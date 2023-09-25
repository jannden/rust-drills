import { Layout } from '@/components/marketing/Layout'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col">
      <Layout>{children}</Layout>
    </div>
  )
}
