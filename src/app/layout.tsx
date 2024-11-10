import type { Metadata } from 'next'
import './globals.css'
import { Poppins, Barlow } from 'next/font/google'
import Providers from '@/utils/provider'
import '@/utils/axiosInstance'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  subsets: ['latin'],
})

const barlow = Barlow({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Bank Statement Parser & Analyzer',
  description:
    'Unlock deep financial insights with our Bank Statement Parser. Instantly analyze bank statements to reveal spending patterns, income trends, and financial health—all in one streamlined tool for smarter decision-making.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${barlow.className}`}>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
