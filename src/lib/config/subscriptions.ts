import { SubscriptionPlan } from '@/lib/types'
import { env } from '@/env.mjs'

export const freePlan: SubscriptionPlan = {
  name: 'Free',
  description: 'The free plan is limited. Upgrade to the PRO plan for more credits.',
  stripePriceId: '',
}

export const proPlan: SubscriptionPlan = {
  name: 'PRO',
  description: 'The PRO plan has more credits.',
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || '',
}
