'use client'
import { Card, Pagination, Title } from '@/components'
import { UserTable } from './components'
import { IconPlus } from '@/icons'
import { useState } from 'react'

const currentUserRole = 'superadmin'
const UserManagementPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)

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
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          totalItems={100}
          itemsPerPage={5}
          onItemsPerPageChange={setItemPerPage}
        />
      </Card>
    </>
  )
}

export default UserManagementPage
