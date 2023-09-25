import { UserSubscriptionPlan } from '@/lib/types'
import { freePlan, proPlan } from '@/lib/config/subscriptions'
import { prisma } from '@/lib/prisma'

export async function getUserSubscriptionPlan(userId: string): Promise<UserSubscriptionPlan> {
  const subscription = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      stripe: true,
    },
  })

  if (!subscription) {
    return {
      ...freePlan,
      isCanceled: false,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      stripeCurrentPeriodEnd: null,
      isPro: false,
    }
  }

  const isPro =
    subscription?.stripe &&
    subscription?.stripe.stripePriceId &&
    subscription?.stripe.stripeCurrentPeriodEnd &&
    subscription?.stripe.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
      ? true
      : false

  const plan = isPro ? proPlan : freePlan

  return {
    ...plan,
    isCanceled: false,
    stripeSubscriptionId: subscription.stripe?.stripeSubscriptionId ?? null,
    stripeCustomerId: subscription.stripe?.stripeCustomerId ?? null,
    stripePriceId: subscription.stripe?.stripePriceId || '0',
    stripeCurrentPeriodEnd: subscription.stripe?.stripeCurrentPeriodEnd?.getTime() ?? null,
    isPro,
  }
}
