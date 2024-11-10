import { Sidebar } from '@/components'
import { Barlow, Poppins } from 'next/font/google'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'

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

const clearCookies = async () => {
  'use server'
  const cookieStore = cookies()
  cookieStore.delete('ACCESS_TOKEN')
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`${barlow.className} ${poppins.className} `}>
      <div className="flex">
        <Sidebar clearCookies={clearCookies}>{children}</Sidebar>
      </div>
    </div>
  )
}

export default DashboardLayout
