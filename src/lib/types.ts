import { Icons } from '@/components/icons'
import { Message } from 'ai/react'

export type User = {
  name: string | null
  email: string | null
  image: string | null
}

export type EmailSignInResponse = {
  email: string
  otp?: string
}

export type VerifyOtpResponse = {
  error?: string
}

export type GeneralResponse<T> = {
  status: number
  data?: T | string
  error?: string
}

export type PageParams = {
  params: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export type VerifiedSessionData = {
  sub: string | undefined
  exp: number | undefined
  userId: string | undefined
}

export type CookieObject = {
  name: string
  value: string
  [attrName: string]: string
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavItem[]
    }
)

export type SiteConfig = {
  name: string
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SidebarConfig = {
  section: string
  items: {
    title: string
    href: string
    icon?: keyof typeof Icons
    disabled?: boolean
  }[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = {
  isPro: boolean
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: number | null
  stripeCustomerId: string | null
} & SubscriptionPlan

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>
