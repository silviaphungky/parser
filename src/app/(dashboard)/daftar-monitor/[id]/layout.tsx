import { Barlow, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import WLInfo from './components/WLInfo/WLInfo'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { clearCookies } from '../../layout'

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

const baseUrl = process.env.BASE_URL || ''

const AnalyticLayout = ({ children }: { children: ReactNode }) => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return (
    <div className={`${barlow.className} ${poppins.className} `}>
      <WLInfo token={token} baseUrl={baseUrl}>
        {children}
      </WLInfo>
    </div>
  )
}

export default AnalyticLayout
