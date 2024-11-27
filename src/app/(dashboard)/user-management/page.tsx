import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { UserList } from './components'
import { clearCookies } from '../layout'

const UserManagementPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return (
    <>
      <UserList token={token} />
    </>
  )
}

export default UserManagementPage
