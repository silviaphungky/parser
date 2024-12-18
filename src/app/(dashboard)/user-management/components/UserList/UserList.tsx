'use client'
import { Card, Title } from '@/components'
import UserTable from '../UserTable'
import { useState } from 'react'
import { IconPlus } from '@/icons'

const UserList = ({ token, baseUrl }: { token: string; baseUrl: string }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const currentUserRole = 'superadmin'

  return (
    <>
      <div className="flex item-center justify-between">
        <Title title="Manejemen Pengguna" />
        {currentUserRole === 'superadmin' && (
          <button
            className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-75"
            onClick={() => setIsOpenModal(true)}
          >
            <IconPlus color="#fff" size={18} />
            Tambahkan Pengguna
          </button>
        )}
      </div>
      <Card className="w-full mt-6">
        <UserTable
          baseUrl={baseUrl}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          token={token}
          currentUserRole="SUPER_ADMIN"
          onCreateUser={() => {}}
          onEditUser={() => {}}
          onDeleteUser={() => {}}
        />
      </Card>
    </>
  )
}

export default UserList
