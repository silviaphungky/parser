import { cookies } from 'next/headers'
import { PNList } from './components'
import { redirect } from 'next/navigation'

const PNPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return <PNList token={token} />
}

export default PNPage
