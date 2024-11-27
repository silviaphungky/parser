import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { UserList } from './components'
import { clearCookies } from '../layout'

const UserManagementPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''
  const role = cookies().get('ROLE')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  if (role !== 'SUPER_ADMIN') {
    redirect('/penyelenggara-negara')
  }

  return (
    <>
      <UserList token={token} />
    </>
  )
}

export default UserManagementPage
