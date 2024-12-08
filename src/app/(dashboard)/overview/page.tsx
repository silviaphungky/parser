import { Title } from '@/components'

import { cookies } from 'next/headers'
import { Summary } from './components'
import { redirect } from 'next/navigation'
import { clearCookies } from '../layout'

const baseUrl = process.env.BASE_URL || ''

const OverviewPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return (
    <div>
      <Title title="Ringkasan" />
      <Summary token={token} baseUrl={baseUrl} />
    </div>
  )
}

export default OverviewPage
