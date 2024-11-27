import { Title } from '@/components'

import { cookies } from 'next/headers'
import { Summary } from './components'
import { redirect } from 'next/navigation'
import { clearCookies } from '../layout'

const OverviewPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return (
    <div>
      <Title title="Ringkasan" />
      <Summary token={token} />
    </div>
  )
}

export default OverviewPage
