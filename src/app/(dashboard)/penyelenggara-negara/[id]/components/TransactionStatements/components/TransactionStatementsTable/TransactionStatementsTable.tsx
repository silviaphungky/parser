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
            <div className="text-xs">{`nama: ${row.name}`}</div>
            <div className="text-xs">{`norek: ${
              row.account_number || '-'
            }`}</div>
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
            : info.getValue() === 'PENDING'
            ? ''
            : 'bg-[#22c55e80] rounded px-2 py-1 text-[#118D57] font-bold text-xs w-fit'
        }`}
        style={{
          background:
            info.getValue() === 'FAILED'
              ? 'rgba(255, 86,48, 0.2)'
              : info.getValue() === 'PENDING'
              ? ''
              : 'rgba(34, 197,98, 0.2)',
        }}
      >
        {info.getValue() === 'FAILED'
          ? 'Gagal'
          : info.getValue() === 'PENDING'
          ? 'Memproses'
          : 'Berhasil'}
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
              <p className="text-sm">Tambahkan laporan bank.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TransactionStatementsTable
