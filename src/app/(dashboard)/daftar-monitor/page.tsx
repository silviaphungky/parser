import { cookies } from 'next/headers'
import { PNList } from './components'
import { redirect } from 'next/navigation'
import { clearCookies } from '../layout'

const baseUrl = process.env.BASE_URL || ''

const PNPage = async () => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return <PNList token={token} baseUrl={baseUrl} />
}

export default PNPage
