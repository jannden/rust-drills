'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { SignedIn, SignedOut, SignInButton, ClerkLoading, ClerkLoaded } from '@clerk/nextjs'
import { Hourglass, User } from 'lucide-react'

import ButtonSignOut from '@/components/ButtonSignOut'
import Button, { ButtonType, ButtonVariant } from '@/components/Button'

type Props = {
  children: React.ReactNode
  buttonVariant?: ButtonVariant
  buttonType?: ButtonType
}

export default function ModalLogin({ children, buttonVariant, buttonType }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={buttonVariant} type={buttonType ?? ButtonType.Button} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div
                      className="relative mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-50 sm:mx-0 sm:size-10"
                      aria-hidden="true"
                    >
                      <User className="absolute inline-flex size-6 animate-ping text-orange-300 opacity-75" />
                      <User className="relative inline-flex size-6 rounded-full text-orange-400" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        User Account
                      </Dialog.Title>
                      <div className="mt-2">
                        <ClerkLoaded>
                          <SignedIn>You are signed in.</SignedIn>
                          <SignedOut>You need to sign in to use this feature.</SignedOut>
                        </ClerkLoaded>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center gap-3 sm:flex-row-reverse sm:justify-start">
                    <ClerkLoading>
                      <Button variant={ButtonVariant.Secondary} type={ButtonType.Button}>
                        <span className="sr-only">Loading</span>
                        <Hourglass aria-hidden="true" className="size-4 stroke-stone-300 transition" />
                      </Button>
                    </ClerkLoading>
                    <ClerkLoaded>
                      <SignedIn>
                        <ButtonSignOut signOutText="Sign Out" />
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <Button variant={ButtonVariant.Primary} type={ButtonType.Button}>
                            Sign In
                          </Button>
                        </SignInButton>
                      </SignedOut>
                    </ClerkLoaded>
                    <Button variant={ButtonVariant.Secondary} type={ButtonType.Button} onClick={() => setOpen(false)}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
