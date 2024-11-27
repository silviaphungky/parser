import { Title } from '@/components'

import { IconPlus } from '@/icons'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { UserList } from './components'

const currentUserRole = 'superadmin'
const UserManagementPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return (
    <>
      <UserList token={token} />
    </>
  )
}

export default UserManagementPage
