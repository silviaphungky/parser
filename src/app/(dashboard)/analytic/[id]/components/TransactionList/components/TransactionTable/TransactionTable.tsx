'use client'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'

type TransactionData = {
  id: string
  index: number
  personalBankName: string
  personalBankAccNo: string
  personalBankAccName: string
  transactionDate: string
  remark: string
  transactionType: string
  targetBankAccNo: string
  targetBankAccName: string
  targetBankName: string
  currency: string
  creditDebit: 'credit' | 'debit'
  mutation: number
  balance: number
}

const defaultData: Array<TransactionData> = [
  {
    id: '1',
    index: 1,
    personalBankName: 'BNI',
    personalBankAccNo: '1234567890',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-01',
    remark: 'Transfer to BCA',
    transactionType: 'Transfer',
    targetBankAccNo: '9876543210',
    targetBankAccName: 'John Doe',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 2000000,
    balance: 10000000,
  },
  {
    id: '2',
    index: 2,
    personalBankName: 'BCA',
    personalBankAccNo: '2345678901',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-03',
    remark: 'Salary Credit',
    transactionType: 'Credit',
    targetBankAccNo: 'N/A',
    targetBankAccName: 'N/A',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 5000000,
    balance: 15000000,
  },
  {
    id: '3',
    index: 3,
    personalBankName: 'Mandiri',
    personalBankAccNo: '3456789012',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-05',
    remark: 'Payment to Vendor',
    transactionType: 'Transfer',
    targetBankAccNo: '4567890123',
    targetBankAccName: 'Jane Smith',
    targetBankName: 'BCA',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 3000000,
    balance: 12000000,
  },
  {
    id: '4',
    index: 4,
    personalBankName: 'BRI',
    personalBankAccNo: '4567890123',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-07',
    remark: 'Refund',
    transactionType: 'Credit',
    targetBankAccNo: 'N/A',
    targetBankAccName: 'N/A',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 1500000,
    balance: 13500000,
  },
  {
    id: '5',
    index: 5,
    personalBankName: 'BNI',
    personalBankAccNo: '5678901234',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-10',
    remark: 'Transfer to Mandiri',
    transactionType: 'Transfer',
    targetBankAccNo: '6789012345',
    targetBankAccName: 'Alice Wong',
    targetBankName: 'Mandiri',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 4000000,
    balance: 9500000,
  },
  {
    id: '6',
    index: 6,
    personalBankName: 'Mandiri',
    personalBankAccNo: '6789012345',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-12',
    remark: 'Bill Payment',
    transactionType: 'Transfer',
    targetBankAccNo: '7890123456',
    targetBankAccName: 'Beta Corporation',
    targetBankName: 'BSI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 2500000,
    balance: 7000000,
  },
  {
    id: '7',
    index: 7,
    personalBankName: 'BCA',
    personalBankAccNo: '7890123456',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-14',
    remark: 'Payment from Client',
    transactionType: 'Credit',
    targetBankAccNo: 'N/A',
    targetBankAccName: 'N/A',
    targetBankName: 'N/A',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 3500000,
    balance: 10500000,
  },
  {
    id: '8',
    index: 8,
    personalBankName: 'BRI',
    personalBankAccNo: '8901234567',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-16',
    remark: 'Electricity Bill',
    transactionType: 'Transfer',
    targetBankAccNo: '9012345678',
    targetBankAccName: 'PLN',
    targetBankName: 'BRI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 1000000,
    balance: 9500000,
  },
  {
    id: '9',
    index: 9,
    personalBankName: 'BNI',
    personalBankAccNo: '9012345678',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-18',
    remark: 'Transfer to BRI',
    transactionType: 'Transfer',
    targetBankAccNo: '0123456789',
    targetBankAccName: 'Charlie Tan',
    targetBankName: 'BRI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 4500000,
    balance: 5000000,
  },
  {
    id: '10',
    index: 10,
    personalBankName: 'Mandiri',
    personalBankAccNo: '0123456789',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-20',
    remark: 'Refund',
    transactionType: 'Credit',
    targetBankAccNo: 'N/A',
    targetBankAccName: 'N/A',
    targetBankName: 'N/A',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 2000000,
    balance: 7000000,
  },
  {
    id: '11',
    index: 11,
    personalBankName: 'BCA',
    personalBankAccNo: '1234567891',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-22',
    remark: 'Food Expenses',
    transactionType: 'Transfer',
    targetBankAccNo: '2345678912',
    targetBankAccName: 'ABC Cafe',
    targetBankName: 'BCA',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 500000,
    balance: 6500000,
  },
  {
    id: '12',
    index: 12,
    personalBankName: 'BRI',
    personalBankAccNo: '2345678912',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-23',
    remark: 'Transfer to BNI',
    transactionType: 'Transfer',
    targetBankAccNo: '3456789123',
    targetBankAccName: 'Diana Lee',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 1200000,
    balance: 5300000,
  },
  {
    id: '13',
    index: 13,
    personalBankName: 'BNI',
    personalBankAccNo: '3456789123',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-24',
    remark: 'Transfer from Mandiri',
    transactionType: 'Credit',
    targetBankAccNo: '4567891234',
    targetBankAccName: 'N/A',
    targetBankName: 'Mandiri',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 3000000,
    balance: 8300000,
  },
  {
    id: '14',
    index: 14,
    personalBankName: 'Mandiri',
    personalBankAccNo: '4567891234',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-25',
    remark: 'Grocery Payment',
    transactionType: 'Transfer',
    targetBankAccNo: '5678912345',
    targetBankAccName: 'Supermart',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 1000000,
    balance: 7300000,
  },
  {
    id: '15',
    index: 15,
    personalBankName: 'BCA',
    personalBankAccNo: '5678912345',
    personalBankAccName: 'Silvia Phungky',
    transactionDate: '2024-10-26',
    remark: 'Transfer from BNI',
    transactionType: 'Credit',
    targetBankAccNo: '6789123456',
    targetBankAccName: 'N/A',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 4000000,
    balance: 11300000,
  },
]

const columnHelper = createColumnHelper<TransactionData>()

const columns = [
  columnHelper.accessor('index', {
    header: 'No.',
    cell: (info) => <div className="text-xs">{info.getValue()}</div>,
  }),
  columnHelper.accessor('transactionDate', {
    header: 'Date',
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
  }),
  columnHelper.accessor(
    (row) => (
      <div>
        <div className="text-sm">{row.personalBankAccName}</div>
        <div className="text-xs">{row.personalBankName}</div>
        <div className="text-xs">{row.personalBankAccNo}</div>
      </div>
    ),
    {
      id: 'personalBankInfo',
      header: 'Personal Bank Info',
      cell: (info) => info.getValue(),
    }
  ),
  columnHelper.accessor('remark', {
    header: 'Remark',
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
  }),
  columnHelper.accessor('transactionType', {
    header: (
      <div>
        <div>Transaction</div>
        <div>Type</div>
      </div>
    ) as any,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor(
    (row) => (
      <div>
        <div className="text-sm">{row.targetBankAccName || 'Unknown'}</div>
        <div className="text-xs">{row.targetBankName || '-'}</div>
        <div className="text-xs">{row.targetBankAccNo || '-'}</div>
      </div>
    ),
    {
      id: 'targetBankInfo',
      header: 'Target Bank Info',
      cell: (info) => info.getValue(),
    }
  ),
  columnHelper.accessor('currency', {
    header: 'Currency',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('creditDebit', {
    header: 'Db / Cr',
    cell: (info) => (info.getValue() === 'credit' ? 'Cr' : 'Db'),
  }),
  columnHelper.accessor('mutation', {
    header: 'Mutation',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('balance', {
    header: 'Balance',
    cell: (info) => info.getValue().toLocaleString(),
  }),
]

const TransactionTable = () => {
  const table = useReactTable({
    data: defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <div
        className="overflow-x-auto"
        style={{
          width: 'calc(100vw - 21rem)',
        }}
      >
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

export default TransactionTable
