'use client'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { IconPencil, IconTrash } from '@/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import { Pagination, Shimmer } from '@/components'
import CreateUserModal from '../CreateUserModal'
import Button from '@/components/Button'
import { baseUrl } from '@/app/(dashboard)/daftar-monitor/[id]/components/UploadBankStatement/UploadBankStatement'
import toast from 'react-hot-toast'

interface UserTableProps {
  token: string
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN'
  onCreateUser: () => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
  isOpenModal: boolean
  setIsOpenModal: Dispatch<SetStateAction<boolean>>
}

export interface User {
  created_at: string
  email: string
  id: string
  is_active: boolean
  role_id: number
  role_name: string
  updated_at: string
}

interface RoleBadgeProps {
  role: 'SUPER_ADMIN' | 'ADMIN'
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  let roleClass = ''

  switch (role) {
    case 'SUPER_ADMIN':
      roleClass = 'bg-[#FFE7E7] text-[#E2000D]'
      break
    case 'ADMIN':
      roleClass = 'bg-[#F8F8F8] text-[#475569]'
      break
    default:
      roleClass = 'bg-[rgba(0,184,156,0.1)] text-[#006C9C]'
  }

  return (
    <span className={`px-3 py-1 rounded text-xs font-semibold ${roleClass}`}>
      {role}
    </span>
  )
}

const UserTable: React.FC<UserTableProps> = ({
  token,
  currentUserRole,
  onCreateUser,
  onEditUser,
  onDeleteUser,
  isOpenModal,
  setIsOpenModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(20)

  const {
    data = {
      app_user_list: [],
      meta_data: { total_page: 1, total: 1, page: 1 },
    },
    isLoading,
    refetch,
  } = useQuery<{
    app_user_list: Array<{
      created_at: string
      email: string
      id: string
      is_active: boolean
      role_id: number
      role_name: string
      updated_at: string
    }>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: ['notifList', currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URL.USER_LIST}`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = response.data
      return data.data
    },
    refetchOnWindowFocus: false,
  })

  const { mutate: removeUser, isPending } = useMutation({
    mutationFn: (payload: { id: string }) =>
      axiosInstance.delete(`${baseUrl}/${API_URL.REMOVE_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: payload.id,
        },
      }),
  })

  const columnHelper = createColumnHelper<User & { action: ReactNode }>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('created_at', {
        header: 'Tanggan dibuat',
        cell: (info) => <div className="text-xs">{info.getValue()}</div>,
      }),
      columnHelper.accessor('email', {
        header: 'Nama',
        cell: (info) => <div className="font-semibold">{info.getValue()}</div>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <div className="text-sm">{info.getValue()}</div>,
      }),
      columnHelper.accessor('role_name', {
        header: 'Role',
        cell: (info) => (
          <RoleBadge role={info.getValue() as 'SUPER_ADMIN' | 'ADMIN'} />
        ),
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated at',
        cell: (info) => <div className="text-xs">{info.getValue()}</div>,
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => {
          const user = row.original

          return (
            <div className="flex space-x-2">
              {/* Edit Button: All users can edit themselves */}
              <button
                className="border p-2 rounded-lg hover:border-gray-400"
                onClick={() => onEditUser(user.id)}
              >
                <IconPencil size={20} />
              </button>

              {/* Delete Button: Only available to admins and superadmins */}
              {currentUserRole === 'SUPER_ADMIN' &&
                user.role_name !== 'SUPER_ADMIN' && (
                  <Button
                    loading={isPending}
                    variant="white-outline"
                    onClick={() => {
                      removeUser(
                        {
                          id: user.id,
                        },
                        {
                          onSuccess: () => {
                            toast.success('Berhasil menghapus pengguna')
                            refetch()
                            setIsOpenModal(false)
                          },
                          onError: (error: any) => {
                            toast.error(
                              `Gagal menghapus pengguna: ${error?.response?.data?.message}`
                            )
                            refetch()
                          },
                        }
                      )
                    }}
                  >
                    <IconTrash color="#EA454C" size={20} />
                  </Button>
                )}
            </div>
          )
        },
      }),
    ],
    [currentUserRole]
  )

  const table = useReactTable({
    data: data.app_user_list as (User & { action: ReactNode })[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      {
        <CreateUserModal
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          refetch={refetch}
          token={token}
        />
      }
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="font-semibold bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="sticky top-0 px-2 py-3 text-left text-sm font-semibold capitalize tracking-wider bg-gray-100"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {!isLoading && (
              <tbody className="divide-y divide-gray-300">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-100 transition-colors duration-300"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-2 py-2 whitespace-nowrap text-sm text-gray-800"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          {isLoading && <Shimmer />}
          {!isLoading && data.app_user_list.length === 0 && (
            <>
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">
                  Tidak ada data yang tersedia
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {data.app_user_list.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.meta_data.total_page}
          onPageChange={setCurrentPage}
          totalItems={data.meta_data.total}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemPerPage}
        />
      )}
    </>
  )
}

export default UserTable
