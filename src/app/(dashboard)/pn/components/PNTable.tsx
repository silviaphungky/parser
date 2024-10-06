'use client'
import * as React from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { numberAbbv } from '@/utils/numberAbbv'
import { IconExpand, IconTrash } from '@/icons'
import Link from 'next/link'

type Person = {
  id: string
  index: number
  name: string
  nik: string
  bankTotal: number
  mutationTotal: number
  transactionTotal: number
  assetTotal: number
}

const defaultData: (Person & { action: string })[] = [
  {
    id: 1,
    index: 1,
    name: 'Test 1',
    nik: '123456789',
    bankTotal: 1,
    mutationTotal: 10,
    transactionTotal: 1893,
    assetTotal: 1929300,
    action: '',
  },
  {
    id: 2,
    index: 2,
    name: 'Test 2',
    nik: '987654321',
    bankTotal: 3,
    mutationTotal: 25,
    transactionTotal: 888,
    assetTotal: 6095955555,
    action: '',
  },
  {
    id: 3,
    index: 3,
    name: 'Test 3',
    nik: '88763931123',
    bankTotal: 0,
    mutationTotal: 0,
    transactionTotal: 0,
    assetTotal: 0,
    action: '',
  },
]

const columnHelper = createColumnHelper<Person & { action: string }>()

const columns = [
  columnHelper.accessor('index', {
    header: () => <span>No.</span>,
    cell: (info) => {
      return info.getValue()
    },
  }),
  columnHelper.accessor('name', {
    header: () => <span>Name</span>,
    cell: (info) => {
      return info.getValue()
    },
  }),
  columnHelper.accessor('nik', {
    header: () => <span>NIK</span>,
    cell: (info) => {
      return info.getValue()
    },
  }),
  columnHelper.accessor('bankTotal', {
    header: () => <span>#Bank</span>,
    cell: (info) => {
      return info.getValue()
    },
  }),
  columnHelper.accessor('mutationTotal', {
    header: () => <span>#Mutation</span>,
    cell: (info) => {
      return thousandSeparator(info.getValue())
    },
  }),
  columnHelper.accessor('transactionTotal', {
    header: () => <span>#Transaction</span>,
    cell: (info) => {
      return thousandSeparator(info.getValue())
    },
  }),
  columnHelper.accessor('assetTotal', {
    header: () => <span>#Total Asset</span>,
    cell: (info) => {
      return `Rp ${numberAbbv(info.getValue())}`
    },
  }),
  columnHelper.accessor('action', {
    header: () => <span>Action</span>,
    cell: (info) => {
      return (
        <div className="flex gap-2">
          <Link href={`/analytic/${info.row.original.id}`}>
            <button className="border p-2 rounded-lg hover:border-gray-400">
              <IconExpand />
            </button>
          </Link>
          <button className="border p-2 rounded-lg hover:border-gray-400">
            <IconTrash color="#EA454C" />
          </button>
        </div>
      )
    },
  }),
]

const PNTable = () => {
  const [data, _setData] = React.useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-semibold capitalize tracking-wider"
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
                  className="px-6 py-2 whitespace-nowrap text-sm text-gray-800"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PNTable
