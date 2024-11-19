import { cookies } from 'next/headers'
import FamilyList from '../components/FamilyList'
import { redirect } from 'next/navigation'

const FamilyListPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return <FamilyList token={token} />
}

export default FamilyListPage
