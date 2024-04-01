import { cn } from '@/lib/utils'
import { type ClassValue } from 'clsx'
import { CheckCircle2, XCircle, Info, AlertCircle, X, Siren } from 'lucide-react'

export enum AlertVariant {
  Green = 'green',
  Blue = 'blue',
  Yellow = 'yellow',
  Red = 'red',
}

interface AlertLink {
  text: string
  href: string
}

interface AlertErrorProps {
  variant: AlertVariant
  message: string
  link?: AlertLink
  isDismissible?: boolean
  className?: ClassValue
}

export default function Alert({ variant, message, link, isDismissible, className }: AlertErrorProps) {
  let Icon = null
  switch (variant) {
    case AlertVariant.Green:
      Icon = CheckCircle2
      break
    case AlertVariant.Blue:
      Icon = Info
      break
    case AlertVariant.Yellow:
      Icon = AlertCircle
      break
    case AlertVariant.Red:
      Icon = Siren
      break
    default:
      console.error(`Unknown variant: ${variant}`)
      return null
  }
  return (
    <div
      className={cn(
        {
          'bg-green-50': variant === AlertVariant.Green,
          'bg-blue-50': variant === AlertVariant.Blue,
          'bg-yellow-50': variant === AlertVariant.Yellow,
          'bg-red-50': variant === AlertVariant.Red,
        },
        'mb-6 block  rounded-md p-4',
        className
      )}
    >
      <div className="flex">
        <div className="shrink-0">
          <Icon
            className={cn(
              {
                'text-green-400': variant === AlertVariant.Green,
                'text-blue-400': variant === AlertVariant.Blue,
                'text-yellow-400': variant === AlertVariant.Yellow,
                'text-red-400': variant === AlertVariant.Red,
              },
              'mt-0.5 size-5'
            )}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p
            className={cn(
              {
                'text-green-700': variant === AlertVariant.Green,
                'text-blue-700': variant === AlertVariant.Blue,
                'text-yellow-700': variant === AlertVariant.Yellow,
                'text-red-700': variant === AlertVariant.Red,
              },
              'text-sm'
            )}
          >
            {message}
          </p>
        </div>
        {isDismissible && (
          <div className="m-1 -mr-1.5 -mt-1 shrink-0">
            <button
              type="button"
              className={cn(
                {
                  'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50':
                    variant === AlertVariant.Green,
                  'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50':
                    variant === AlertVariant.Blue,
                  'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50':
                    variant === AlertVariant.Yellow,
                  'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50':
                    variant === AlertVariant.Red,
                },
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2'
              )}
            >
              <span className="sr-only">Dismiss</span>
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {link ? (
        <p className="p-1 text-right">
          <a
            href={link.href}
            className={cn(
              {
                'text-green-700 hover:text-green-600': variant === AlertVariant.Green,
                'text-blue-700 hover:text-blue-600': variant === AlertVariant.Blue,
                'text-yellow-700 hover:text-yellow-600': variant === AlertVariant.Yellow,
                'text-red-700 hover:text-red-600': variant === AlertVariant.Red,
              },
              'whitespace-nowrap text-sm font-semibold'
            )}
          >
            {link.text}
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </p>
      ) : null}
    </div>
  )
}
