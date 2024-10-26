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

const AnalyticLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div>analytic layout</div>
      {children}
    </div>
  )
}

export default AnalyticLayout
