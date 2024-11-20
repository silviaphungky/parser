'use client'
import { Shimmer } from '@/components'

import { colorToken } from '@/constants/color-token'
import {
  IconBCA,
  IconBNI,
  IconBRI,
  IconMandiri,
  IconTrash,
  IconTriangleDown,
} from '@/icons'

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useState } from 'react'
import { IStatement } from '../../TransactionStatementList'
import dayjs from 'dayjs'

export type TransactionBankStatementData = {
  id: string
  name: string
  url: string
  period: {
    from: string
    to: string
  }
  bank: {
    name: 'BCA' | 'BNI' | 'Mandiri' | 'BRI'
    accountNo: string
    accountName: string
  }
  uploaded_at: string
}

export const transactionBankStatements: Array<
  TransactionBankStatementData & { action: string }
> = [
  {
    id: '1',
    name: 'Bank Statement Jan 2024',
    url: 'https://example.com/bank-statement-jan-2024',
    period: {
      from: '2024-01-01',
      to: '2024-01-31',
    },
    bank: {
      name: 'BCA',
      accountNo: '1234567890',
      accountName: 'John Doe',
    },
    uploaded_at: '2024-02-01',
    action: '',
  },
  {
    id: '2',
    name: 'Bank Statement Feb 2024',
    url: 'https://example.com/bank-statement-feb-2024',
    period: {
      from: '2024-02-01',
      to: '2024-02-28',
    },
    bank: {
      name: 'BNI',
      accountNo: '2345678901',
      accountName: 'Jane Smith',
    },
    uploaded_at: '2024-03-01',
    action: '',
  },
  {
    id: '3',
    name: 'Bank Statement Mar 2024',
    url: 'https://example.com/bank-statement-mar-2024',
    period: {
      from: '2024-03-01',
      to: '2024-03-31',
    },
    bank: {
      name: 'Mandiri',
      accountNo: '3456789012',
      accountName: 'Robert Brown',
    },
    uploaded_at: '2024-04-01',
    action: '',
  },
  {
    id: '4',
    name: 'Bank Statement Apr 2024',
    url: 'https://example.com/bank-statement-apr-2024',
    period: {
      from: '2024-04-01',
      to: '2024-04-30',
    },
    bank: {
      name: 'BRI',
      accountNo: '4567890123',
      accountName: 'Alice Johnson',
    },
    uploaded_at: '2024-05-01',
    action: '',
  },
  {
    id: '5',
    name: 'Bank Statement May 2024',
    url: 'https://example.com/bank-statement-may-2024',
    period: {
      from: '2024-05-01',
      to: '2024-05-31',
    },
    bank: {
      name: 'BCA',
      accountNo: '5678901234',
      accountName: 'Michael Clark',
    },
    uploaded_at: '2024-06-01',
    action: '',
  },
  {
    id: '6',
    name: 'Bank Statement Jun 2024',
    url: 'https://example.com/bank-statement-jun-2024',
    period: {
      from: '2024-06-01',
      to: '2024-06-30',
    },
    bank: {
      name: 'BNI',
      accountNo: '6789012345',
      accountName: 'Emma Wilson',
    },
    uploaded_at: '2024-07-01',
    action: '',
  },
  {
    id: '7',
    name: 'Bank Statement Jul 2024',
    url: 'https://example.com/bank-statement-jul-2024',
    period: {
      from: '2024-07-01',
      to: '2024-07-31',
    },
    bank: {
      name: 'Mandiri',
      accountNo: '7890123456',
      accountName: 'Olivia Martin',
    },
    uploaded_at: '2024-08-01',
    action: '',
  },
  {
    id: '8',
    name: 'Bank Statement Aug 2024',
    url: 'https://example.com/bank-statement-aug-2024',
    period: {
      from: '2024-08-01',
      to: '2024-08-31',
    },
    bank: {
      name: 'BRI',
      accountNo: '8901234567',
      accountName: 'Sophia Lee',
    },
    uploaded_at: '2024-09-01',
    action: '',
  },
  {
    id: '9',
    name: 'Bank Statement Sep 2024',
    url: 'https://example.com/bank-statement-sep-2024',
    period: {
      from: '2024-09-01',
      to: '2024-09-30',
    },
    bank: {
      name: 'BCA',
      accountNo: '9012345678',
      accountName: 'James White',
    },
    uploaded_at: '2024-10-01',
    action: '',
  },
  {
    id: '10',
    name: 'Bank Statement Oct 2024',
    url: 'https://example.com/bank-statement-oct-2024',
    period: {
      from: '2024-10-01',
      to: '2024-10-31',
    },
    bank: {
      name: 'BNI',
      accountNo: '0123456789',
      accountName: 'Amelia Davis',
    },
    uploaded_at: '2024-11-01',
    action: '',
  },
]

const iconBankMap = {
  BCA: <IconBCA size={24} />,
  BRI: <IconBRI size={24} />,
  BNI: <IconBNI size={24} />,
  Mandiri: <IconMandiri size={24} />,
}

const columnHelper = createColumnHelper<IStatement & { action: string }>()

const columns = [
  columnHelper.accessor('created_at', {
    header: 'Tanggal Upload',
    cell: (info) => dayjs(new Date(info.getValue())).format('DD/MM/YYYY'),
  }),
  columnHelper.accessor('file_name', {
    header: 'Nama File',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor(
    (row) => (
      <div>
        <div className="flex gap-2 mt-2 items-center">
          {
            iconBankMap[
              row.bank_short_code as 'BNI' | 'Mandiri' | 'BCA' | 'BRI'
            ]
          }
          <div className="text-x">{row.bank_name}</div>
        </div>
      </div>
    ),
    {
      id: 'bankName',
      header: 'Bank',
      cell: (info) => info.getValue(),
      enableSorting: false,
    }
  ),
  columnHelper.accessor(
    (row) => (
      <div>
        <div className="flex gap-2 mt-2 items-center">
          <div>
            <div className="text-xs">{'row.bank.accountName'}</div>
            <div className="text-xs">{`${row.account_number}`}</div>
          </div>
        </div>
      </div>
    ),
    {
      id: 'bankAccount',
      header: 'Akun Bank',
      cell: (info) => info.getValue(),
      enableSorting: false,
    }
  ),
  columnHelper.accessor('currency', {
    header: 'Mata Uang',
    cell: (info) => <div className={'text-sm'}>{info.getValue()}</div>,
    enableSorting: false,
  }),
  columnHelper.accessor('status', {
    header: 'Status Ekstrak',
    cell: (info) => (
      <div
        className={`${
          info.getValue() === 'FAILED'
            ? 'rounded p-2 py-1 text-[#B71D18] font-bold text-xs w-fit'
            : 'bg-[#22c55e80] rounded px-2 py-1 text-[#118D57] font-bold text-xs w-fit'
        }`}
        style={{
          background:
            info.getValue() === 'FAILED'
              ? 'rgba(255, 86,48, 0.2)'
              : 'rgba(34, 197,98, 0.2)',
        }}
      >
        {info.getValue() === 'FAILED' ? 'Gagal' : 'Berhasil'}
      </div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor(
    (row) =>
      `${
        row.status !== 'FAILED'
          ? `${dayjs(new Date(row.start_period)).format(
              'DD/MM/YYYY'
            )} - ${dayjs(new Date(row.end_period)).format('DD/MM/YYYY')}`
          : '-'
      }`,
    {
      id: 'period',
      header: 'Periode',
      cell: (info) => info.getValue(),
    }
  ),
  columnHelper.accessor('file_url', {
    header: 'URL',
    cell: (info) =>
      info.getValue() ? (
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Lihat Dokumen
        </a>
      ) : (
        '-'
      ),
    enableSorting: false,
  }),
  columnHelper.accessor('action', {
    header: () => <span>Aksi</span>,
    cell: (info) => {
      return (
        <div className="flex gap-3">
          <button className="border p-2 rounded-lg hover:border-gray-400">
            <IconTrash size={20} color="#EA454C" />
          </button>
        </div>
      )
    },
    enableSorting: false,
  }),
]

const TransactionStatementsTable = ({
  statementList,
  isLoading,
}: {
  statementList: Array<IStatement>
  isLoading: boolean
}) => {
  const [sorting, setSorting] = useState([])
  const table = useReactTable({
    data: statementList as Array<IStatement & { action: string }>,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting as any,
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="font-semibold bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`sticky top-0 px-2 py-3 text-left text-sm font-semibold capitalize tracking-wider bg-gray-100 ${
                    header.column.getIsSorted() ? 'bg-gray-200' : 'bg-gray-100'
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex gap-0 items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div>
                          <div className="rotate-180">
                            <IconTriangleDown
                              size={8}
                              color={
                                header.column.getIsSorted() === 'asc'
                                  ? colorToken.darkGrafit
                                  : colorToken.grayVulkanik
                              }
                            />
                          </div>
                          <IconTriangleDown
                            size={8}
                            color={
                              header.column.getIsSorted() === 'desc'
                                ? colorToken.darkGrafit
                                : colorToken.grayVulkanik
                            }
                          />
                        </div>
                      )}
                    </div>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {isLoading && <Shimmer />}
      {!isLoading && (
        <>
          {statementList.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg font-medium">
                Tidak ada data yang tersedia
              </p>
              <p className="text-sm">Tambahkan mutasi bank.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TransactionStatementsTable
