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
  title: 'KPK Parser | Analisis Mutasi Keuangan Daftar Monitor',
  description: 'KPK Parser | Analisis Mutasi Keungan Daftar Monitor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${barlow.className}`}>
        <Toaster
          toastOptions={{
            style: {
              fontSize: '14px',
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
