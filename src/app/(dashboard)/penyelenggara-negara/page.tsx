import { cookies } from 'next/headers'
import { PNList } from './components'
import { redirect } from 'next/navigation'

const PNPage = async () => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return <PNList token={token} />
}

export default PNPage
