import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import Link from 'next/link'
import React from 'react'

export enum ButtonType {
  Button = 'button',
  Submit = 'submit',
  Link = 'link',
}

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Soft = 'soft',
  Text = 'text',
}

export type ButtonProps = {
  children: React.ReactNode
  type: ButtonType
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: ButtonVariant
  disabled?: boolean
  href?: string
  className?: ClassValue
  target?: string
}

export default function Button({ onClick, variant, children, type, disabled, href, className, target }: ButtonProps) {
  let classes
  switch (variant) {
    case ButtonVariant.Secondary:
      classes = cn(
        'inline-block whitespace-nowrap rounded-md bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        { 'cursor-default text-gray-700 bg-gray-50 shadow-inner': disabled },
        className
      )
      break
    case ButtonVariant.Soft:
      classes = cn(
        'inline-block whitespace-nowrap rounded-md bg-orange-50 px-6 py-3 text-center text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-100',
        { 'cursor-default text-orange-400 shadow-inner': disabled },
        className
      )
      break
    case ButtonVariant.Text:
      classes = cn(
        'inline-block cursor-pointer whitespace-nowrap text-center text-sm font-medium text-orange-600 [text-wrap:balance] hover:text-orange-500',
        { 'cursor-default text-orange-400 shadow-inner': disabled },
        className
      )
      break
    default:
      // ButtonVariant.Primary
      classes = cn(
        'inline-block whitespace-nowrap rounded-md bg-orange-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
        { 'cursor-default bg-orange-200 shadow-inner': disabled },
        className
      )
  }

  switch (type) {
    case ButtonType.Link:
      if (!href && !disabled) {
        console.error('ButtonType.Link requires href')
        return null
      }
      return (
        <Link href={!href ? '#' : href} className={cn(classes, { 'pointer-events-none': disabled })} target={target}>
          {children}
        </Link>
      )
    case ButtonType.Submit:
      return (
        <button type="submit" className={classes} disabled={disabled}>
          {children}
        </button>
      )
    case ButtonType.Button:
      return (
        <button onClick={onClick} type="button" className={classes} disabled={disabled}>
          {children}
        </button>
      )
    default:
      console.error('ButtonType not supported')
      return null
  }
}
