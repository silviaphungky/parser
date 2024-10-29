'use client'
import React, { ReactNode, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { IconPencil, IconPlus, IconTrash } from '@/icons'

interface UserTableProps {
  currentUserRole: 'superadmin' | 'admin' | 'non-admin'
  onCreateUser: () => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

const mockUserList = [
  {
    id: '1a2b3c4d',
    role: 'superadmin',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    created_at: '2023-09-01T12:30:00Z',
    updated_at: '2024-10-21T08:45:00Z',
  },
  {
    id: '2b3c4d5e',
    role: 'admin',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    created_at: '2023-05-15T14:20:00Z',
    updated_at: '2024-09-30T16:10:00Z',
  },
  {
    id: '3c4d5e6f',
    role: 'non-admin',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    created_at: '2023-03-10T10:00:00Z',
    updated_at: '2024-10-20T09:30:00Z',
  },
  {
    id: '4d5e6f7g',
    role: 'admin',
    name: 'Diana Miller',
    email: 'diana.miller@example.com',
    created_at: '2023-07-25T09:15:00Z',
    updated_at: '2024-08-10T14:05:00Z',
  },
  {
    id: '5e6f7g8h',
    role: 'non-admin',
    name: 'Evan Taylor',
    email: 'evan.taylor@example.com',
    created_at: '2023-01-20T11:45:00Z',
    updated_at: '2024-10-15T13:00:00Z',
  },
]

export interface User {
  id: string
  role: 'superadmin' | 'admin' | 'non-admin'
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface RoleBadgeProps {
  role: 'superadmin' | 'admin' | 'non-admin'
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  let roleClass = ''

  switch (role) {
    case 'superadmin':
      roleClass = 'bg-[#FFE7E7] text-[#E2000D]'
      break
    case 'admin':
      roleClass = 'bg-[#F8F8F8] text-[#475569]'
      break
    case 'non-admin':
      roleClass = 'bg-[rgba(0,184,156,0.1)] text-[#006C9C]'
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
  currentUserRole,
  onCreateUser,
  onEditUser,
  onDeleteUser,
}) => {
  const columnHelper = createColumnHelper<User & { action: ReactNode }>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('created_at', {
        header: 'Created at',
        cell: (info) => <div className="text-xs">{info.getValue()}</div>,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <div className="font-semibold">{info.getValue()}</div>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <div className="text-sm">{info.getValue()}</div>,
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => <RoleBadge role={info.getValue()} />,
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
              {currentUserRole === 'superadmin' &&
                user.role !== 'superadmin' && (
                  <button className="border p-2 rounded-lg hover:border-gray-400">
                    <IconTrash color="#EA454C" size={20} />
                  </button>
                )}

              {currentUserRole === 'admin' && user.role === 'non-admin' && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => onDeleteUser(user.id)}
                >
                  delete
                </button>
              )}
            </div>
          )
        },
      }),
    ],
    [currentUserRole]
  )

  const table = useReactTable({
    data: mockUserList as (User & { action: ReactNode })[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable
