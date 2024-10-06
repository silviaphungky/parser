import { Sidebar } from '@/components'
import { Barlow, Poppins } from 'next/font/google'
import { ReactNode } from 'react'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  subsets: ['latin'],
})

const barlow = Barlow({
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  subsets: ['latin'],
})

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`${barlow.className} ${poppins.className} `}>
      <div className="flex">
        <Sidebar />
        <div className="ml-60 w-full bg-soft min-h-[100vh] px-6 pt-6">
          <div className="font-semibold text-lg text-right mb-4">
            Hi, John Doe 👋🏼
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
