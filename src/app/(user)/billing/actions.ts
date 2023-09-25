'use server'

import { revalidatePath } from 'next/cache'

import { stripe } from '@/lib/stripe'
import { getUserSubscriptionPlan } from '@/lib/server/getSubscription'
import { currentUser } from '@clerk/nextjs/server'

import { proPlan } from '@/lib/config/subscriptions'
import { absoluteUrl, logError } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { FormState } from '@/lib/types'
import { env } from '@/env.mjs'

const billingUrl = absoluteUrl(env.NEXT_PUBLIC_BILLING_URL)

export async function openStripe(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const userClerk = await currentUser()
    if (!userClerk) throw new Error('User not found.')

    const subscriptionPlan = await getUserSubscriptionPlan(userClerk.id)

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      })
      revalidatePath('/')
      return { message: stripeSession.url, ok: true }
    }

    const userDb = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userClerk.id,
      },
    })

    // The user is on the free plan.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userDb.email,
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userDb.id,
      },
    })

    if (!stripeSession.url) throw new Error(`Error getting Stripe session url -> ${JSON.stringify(stripeSession)}`)

    revalidatePath('/')
    return { message: stripeSession.url, ok: true }
  } catch (error) {
    const publicErrorMessage = 'Billing form action error'
    logError(publicErrorMessage, error)
    return { message: publicErrorMessage, ok: false }
  }
}
