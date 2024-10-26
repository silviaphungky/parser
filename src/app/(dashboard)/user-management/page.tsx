'use client'
import { Card, Title } from '@/components'
import { UserTable } from './components'
import { IconPlus } from '@/icons'

const currentUserRole = 'superadmin'
const UserManagementPage = () => {
  return (
    <>
      <div className="flex item-center justify-between">
        <Title title="User Management" />
        {currentUserRole === 'superadmin' && (
          <button className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95">
            <IconPlus color="#fff" size={18} />
            Add User
          </button>
        )}
      </div>
      <Card className="w-full mt-6">
        <UserTable
          currentUserRole="superadmin"
          onCreateUser={() => {}}
          onEditUser={() => {}}
          onDeleteUser={() => {}}
        />
      </Card>
    </>
  )
}

export default UserManagementPage
