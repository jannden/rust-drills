import { JetBrains_Mono as FontMono, Inter as FontSans, DM_Sans as FontDmSans } from 'next/font/google'

export const fontMono = FontMono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const fontSans = FontSans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const fontDmSans = FontDmSans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
})
