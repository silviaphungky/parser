import { Barlow, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import WLInfo from './components/WLInfo/WLInfo'

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

const PNDATA = {
  name: 'Anton',
  nik: '12345678',
  totalAsset: 456789876,
}

const AnalyticLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`${barlow.className} ${poppins.className} `}>
      <WLInfo data={PNDATA} />
      {children}
    </div>
  )
}

export default AnalyticLayout
