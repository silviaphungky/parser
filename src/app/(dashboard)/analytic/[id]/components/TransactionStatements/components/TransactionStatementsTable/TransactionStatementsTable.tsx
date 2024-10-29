'use client'
import { IconTrash } from '@/icons'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'

export type TransactionBankStatementData = {
  id: string
  name: string
  url: string
  period: {
    from: string
    to: string
  }
  bank: {
    name: 'BCA' | 'BNI' | 'MANDIRI' | 'BRI'
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
      name: 'MANDIRI',
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
      name: 'MANDIRI',
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

const columnHelper = createColumnHelper<
  TransactionBankStatementData & { action: string }
>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => `${row.period.from} - ${row.period.to}`, {
    id: 'period',
    header: 'Period',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor(
    (row) => (
      <div>
        <div className="text-sm">{row.bank.accountName}</div>
        <div className="text-xs">{`${row.bank.name} - ${row.bank.accountNo}`}</div>
      </div>
    ),
    {
      id: 'bankInfo',
      header: 'Bank Info',
      cell: (info) => info.getValue(),
    }
  ),
  columnHelper.accessor('uploaded_at', {
    header: 'Uploaded At',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Document
      </a>
    ),
  }),
  columnHelper.accessor('action', {
    header: () => <span>Action</span>,
    cell: (info) => {
      return (
        <div className="flex gap-3">
          <button className="border p-2 rounded-lg hover:border-gray-400">
            <IconTrash size={20} color="#EA454C" />
          </button>
        </div>
      )
    },
  }),
]

const TransactionStatementsTable: React.FC = () => {
  const table = useReactTable({
    data: transactionBankStatements,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
  )
}

export default TransactionStatementsTable
