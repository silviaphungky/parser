import { Barlow, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import WLInfo from './components/WLInfo/WLInfo'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

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
  family: [
    {
      name: 'Lina',
      relation: 'Istri/Suami',
      id: '5',
      NIK: '999999',
    },
    {
      name: 'Burhan',
      relation: 'Orang tua',
      id: '3',
      NIK: '88888',
    },
    {
      name: 'Inara',
      relation: 'Lainnya',
      relationNote: 'Tante',
      id: '3',
      NIK: '77777',
    },
  ],
}

const AnalyticLayout = ({ children }: { children: ReactNode }) => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return (
    <div className={`${barlow.className} ${poppins.className} `}>
      <WLInfo token={token}>{children}</WLInfo>
    </div>
  )
}

export default AnalyticLayout
