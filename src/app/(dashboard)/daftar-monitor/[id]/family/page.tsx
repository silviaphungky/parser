import { cookies } from 'next/headers'
import FamilyList from '../components/FamilyList'
import { redirect } from 'next/navigation'
import { clearCookies } from '@/app/(dashboard)/layout'

const FamilyListPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return <FamilyList token={token} />
}

export default FamilyListPage
