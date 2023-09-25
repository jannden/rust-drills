'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs'
import { EmailCodeFactor, SignInFirstFactor } from '@clerk/types'

import { cn } from '@/lib/utils'
import Logo from '@/components/user/Logo'
import Alert, { AlertVariant } from '@/components/user/Alert'

export default function Form() {
  const router = useRouter()
  const { isLoaded: isUserLoaded, isSignedIn } = useUser()
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp()
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn()
  const [verifying, setVerifying] = useState(false)
  const [isSignUp, setIsSignUp] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isSignInLoaded || !isSignUpLoaded) return null

    // Assumtion, because Clerk is stupid - it wants first to use the signUp method and subsequently the signIn method. That requires us to create two pages which is unnecessarily confusing for a user expecting to receive verification code by email regardless of whether it's the first time logging in (signing up) or subsequent times (signing in)
    let isRegistered = true
    try {
      // Start the Sign In process using the email number method
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      })

      // Filter the returned array to find the 'email_code' entry
      const isEmailCodeFactor = (factor: SignInFirstFactor): factor is EmailCodeFactor => {
        return factor.strategy === 'email_code'
      }
      const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor)

      if (emailCodeFactor) {
        // Grab the emailAddressId
        const { emailAddressId } = emailCodeFactor

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        })

        // Set 'verifying' true to display second form and capture the OTP code
        setVerifying(true)
        setIsSignUp(false)
      }
    } catch (err: any) {
      if (err?.errors?.[0]?.message === "Couldn't find your account.") {
        isRegistered = false
      } else {
        setError(`There was an error: ${err?.errors?.[0]?.message} - ${err?.errors?.[0]?.longMessage}`)
        console.error('Error:', JSON.stringify(err, null, 2))
      }
    }

    // Not registered, so let's sign up
    if (!isRegistered) {
      setIsSignUp(true)
      try {
        await signUp.create({
          emailAddress: email,
        })
        await signUp.prepareEmailAddressVerification()

        // Set 'verifying' true to display second form and capture the OTP code
        setVerifying(true)
      } catch (err: any) {
        setError(`There was an error: ${err?.errors?.[0]?.message} - ${err?.errors?.[0]?.longMessage}`)
        console.error('Error:', JSON.stringify(err, null, 2))
      }
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault()

    if (!isSignInLoaded || !isSignUpLoaded) return null

    let mightBeSignedUp = false
    if (!isSignUp) {
      try {
        // Use the code provided by the user and attempt verification
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        })

        // If verification was completed, create a session for the user
        if (completeSignIn.status === 'complete') {
          await setSignInActive({ session: completeSignIn.createdSessionId })

          // TODO: Redirect user to the sign-up page which will update user account and redirect to the dashboard
          // TODO: Needs refactoring:
          // TODO: Here should be a fetch request to the backend to update a user account and then redirect to the dashboard
          router.push('/sign-up')
        }
      } catch (err: any) {
        if (
          isSignUp === null &&
          err?.errors?.[0]?.longMessage ===
            'We were unable to complete Factor One Verification for this Client. This Sign In Attempt is not Identified, please identify first.'
        ) {
          mightBeSignedUp = true
        } else {
          setError(`There was an error: ${err?.errors?.[0]?.message} - ${err?.errors?.[0]?.longMessage}`)
        }
        console.error('Error:', JSON.stringify(err, null, 2))
      }
    }

    if (isSignUp || mightBeSignedUp) {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        })

        if (completeSignUp.status === 'complete') {
          await setSignUpActive({ session: completeSignUp.createdSessionId })

          // TODO: Redirect user to the sign-up page which will update user account and redirect to the dashboard
          // TODO: Needs refactoring:
          // TODO: Here should be a fetch request to the backend to update a user account and then redirect to the dashboard
          router.push('/sign-up')
        }
        return
      } catch (err: any) {
        setError(`There was an error: ${err?.errors?.[0]?.message} - ${err?.errors?.[0]?.longMessage}`)
        console.error('Error:', JSON.stringify(err, null, 2))
      }
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      // User already signed in
      // TODO: Redirect user to the sign-up page which will update user account and redirect to the dashboard
      // TODO: Needs refactoring:
      // TODO: Here should be a fetch request to the backend to update a user account and then redirect to the dashboard
      router.push('/sign-up')
    }
  }, [isSignedIn, router])

  if (!isSignInLoaded || !isSignUpLoaded || !isUserLoaded || isSignedIn) {
    return (
      <div className="flex justify-center pt-24">
        <Loader2 className="size-10 animate-spin text-slate-200" />
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo />
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {verifying ? 'Verify your email address' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={verifying ? handleVerification : handleSubmit} className="space-y-6" action="#" method="POST">
          {verifying ? (
            <div>
              <label id="code" htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                Code from email
              </label>
              <div className="mt-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  id="code"
                  name="code"
                  type="number"
                  required
                  className={cn(
                    'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                  )}
                />
              </div>
            </div>
          ) : (
            <div>
              <label id="email" htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {verifying ? 'Verify' : 'Send code'}
            </button>
          </div>
        </form>

        {verifying ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            We sent the verification code to your email address.
            <br />
            Didn&apos;t receive the code?{' '}
            <button
              onClick={() => setVerifying(false)}
              type="button"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Get it here.
            </button>
          </p>
        ) : (
          <p className="mt-10 text-center text-sm text-gray-500">
            We will send a verification code to your email address.
            <br />
            Already have the code?{' '}
            <button
              onClick={() => setVerifying(true)}
              type="button"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Fill it in here.
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
