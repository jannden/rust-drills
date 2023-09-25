'use client'

import { use, useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, Lock, Unlock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button, { ButtonType, ButtonVariant } from '@/components/user/Button'

export type RadioGroupOption = {
  id: string
  title: string
  description?: string
  cost?: string
}

export type RadioGroupProps = {
  name: string
  options: RadioGroupOption[]
  title?: string
  linkTitle?: React.ReactNode
  handleLinkClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleChange?: (value: string) => void
}

const UnlockMore = () => (
  <div className="group flex items-center gap-2">
    <Lock className="size-3 group-hover:hidden" />
    <Unlock className="hidden size-3 group-hover:block" />
    <span>Unlock more</span>
  </div>
)

export default function RadioGroupComponent({
  name,
  options,
  title,
  linkTitle = <UnlockMore />,
  handleLinkClick,
  handleChange,
}: RadioGroupProps) {
  const [selectedOption, setSelectedOption] = useState<string>()
  useEffect(() => {
    if (handleChange && selectedOption) {
      handleChange(selectedOption)
    }
  }, [handleChange, selectedOption])

  if (!name || !options) return null
  return (
    <RadioGroup value={selectedOption} onChange={setSelectedOption} name={name}>
      <div className="mb-4 flex items-center">
        <RadioGroup.Label className="flex-1 text-base font-semibold leading-6 text-gray-900 [text-wrap:balance]">
          {title && <span>{title}</span>}
        </RadioGroup.Label>
        {linkTitle && handleLinkClick && (
          <div className={title ? 'ml-6' : ''}>
            <Button variant={ButtonVariant.Text} type={ButtonType.Button} onClick={handleLinkClick}>
              {linkTitle}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.id}
            value={option.id}
            className={({ active }) =>
              cn(
                active ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300',
                'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50 focus:outline-none'
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                      {option.title}
                    </RadioGroup.Label>
                    {option.description && (
                      <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                        {option.description}
                      </RadioGroup.Description>
                    )}
                    {option.cost && (
                      <RadioGroup.Description
                        as="span"
                        className="mt-6 flex items-center gap-1 text-sm font-medium text-gray-900"
                      >
                        <Zap className="size-3" aria-hidden="true" />
                        {option.cost}
                      </RadioGroup.Description>
                    )}
                  </span>
                </span>
                <CheckCircleIcon
                  className={cn(!checked ? 'invisible' : '', 'size-5 text-indigo-600')}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    active ? 'border' : 'border-2',
                    checked ? 'border-indigo-600' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg'
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
