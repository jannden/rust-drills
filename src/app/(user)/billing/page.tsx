'use server'

import { stripe } from '@/lib/stripe'
import { getUserSubscriptionPlan } from '@/lib/server/getSubscription'
import { currentUser } from '@clerk/nextjs/server'
import Heading from '@/components/user/Heading'
import { formatDate } from '@/lib/utils'
import { BillingForm } from './BillingForm'

export default async function BillingPage() {
  const user = await currentUser()
  if (!user) {
    return null
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false
  if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(subscriptionPlan.stripeSubscriptionId)
    isCanceled = stripePlan.cancel_at_period_end
  }

  return (
    <>
      <Heading heading="Billing" description="Manage billing and your subscription plan." />
      <p>
        You are currently on the <strong>{subscriptionPlan.name}</strong> plan.
      </p>
      <p>{subscriptionPlan.description}</p>
      {subscriptionPlan.isPro && (
        <p className="rounded-full text-xs font-medium">
          {subscriptionPlan.isCanceled ? 'Your plan will be canceled on ' : 'Your plan renews on '}
          {subscriptionPlan.stripeCurrentPeriodEnd ? formatDate(subscriptionPlan.stripeCurrentPeriodEnd) : '?'}.
        </p>
      )}
      <BillingForm isPro={subscriptionPlan.isPro} />
    </>
  )
}
