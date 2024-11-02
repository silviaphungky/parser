import { useEffect, useRef, useState } from 'react'
import { IconBCA, IconBNI, IconBRI, IconKebab, IconMandiri } from '@/icons'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import useOutsideClick from '@/utils/useClickOutside'
import { Modal } from '@/components'
import TransactionCategoryModal from '../TransactionCategoryModal'

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
  note?: string
  isHighlight: boolean
  category: {
    id: string
    label: string
  }
}

const defaultData: Array<TransactionData & { actions: any }> = [
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
    note: 'catatan awal',
    isHighlight: true,
    actions: true,
    category: {
      id: '1',
      label: 'belanja',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
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
    note: '',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
  },
]

const columnHelper = createColumnHelper<TransactionData & { actions: any }>()

const iconBankMap = {
  BCA: <IconBCA size={24} />,
  BRI: <IconBRI size={24} />,
  BNI: <IconBNI size={24} />,
  Mandiri: <IconMandiri size={24} />,
}

const TransactionTable = () => {
  const ref = useRef(null)
  const [selected, setSelected] = useState({} as TransactionData)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenVerfiModal, setIsOpenVerifModal] = useState(false)
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false)

  const onClose = () => {
    setIsOpen(false)
    setSelected({} as TransactionData)
  }

  const handleMenuToggle = (id: string) => {
    setActionMenu((prev) => (prev === id ? null : id))
  }

  const columns = [
    columnHelper.accessor(
      (row) => (
        <div className="flex gap-2 items-center">
          <div className="text-xs">{row.transactionDate}</div>
          {row.isHighlight && (
            <div className="ml-1 rounded-full w-[0.4rem] h-[0.4rem] bg-yellow-500 animate-ping" />
          )}
        </div>
      ),
      {
        id: 'transactionDate',
        header: 'Tanggal',
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor(
      (row) => (
        <div>
          <div className="flex gap-2 mt-2 items-center">
            {
              iconBankMap[
                row.personalBankName as 'BNI' | 'BCA' | 'BRI' | 'Mandiri'
              ]
            }
            <div>
              <div className="text-xs font-semibold">
                {row.personalBankAccName}
              </div>
              <div className="text-xs">{`${row.personalBankName} - ${row.personalBankAccNo}`}</div>
            </div>
          </div>
        </div>
      ),
      {
        id: 'personalBankInfo',
        header: 'Info Bank PN',
        cell: (info) => info.getValue(),
      }
    ),

    columnHelper.accessor('transactionType', {
      header: (
        <div>
          <div>Tipe</div>
          <div>Transaksi</div>
        </div>
      ) as any,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor(
      (row) => (
        <div>
          <div className="text-xs font-semibold">
            {row.targetBankAccName || 'Unknown'}
          </div>
          <div className="text-xs">{row.targetBankName || '-'}</div>
          <div className="text-xs">{row.targetBankAccNo || '-'}</div>
        </div>
      ),
      {
        id: 'targetBankInfo',
        header: 'Info Bank Transaksi',
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor(
      (row) => (
        <>
          {row.creditDebit === 'debit' && (
            <span
              className="rounded p-2 py-1 text-[#B71D18] font-bold text-xs"
              style={{ background: 'rgba(255, 86,48, 0.2)' }}
            >
              Db
            </span>
          )}
          {row.creditDebit === 'credit' && (
            <span
              className="bg-[#22c55e80] rounded px-2 py-1 text-[#118D57] font-bold text-xs"
              style={{ background: 'rgba(34, 197,98, 0.2)' }}
            >
              Cr
            </span>
          )}
        </>
      ),
      {
        id: 'creditDebit',
        header: 'Db / Cr',
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor('currency', {
      header: 'Mata Uang',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('remark', {
      header: 'Remark',
      cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor('category.label', {
      header: 'Kategori',
      cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor('mutation', {
      header: 'Nominal Transkasi',
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('balance', {
      header: 'Saldo',
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor(
      (row) => (
        <div className="overflow-wrap: break-word">
          <div className="text-sm max-w-[2rem]">{row.note || '-'}</div>
        </div>
      ),
      {
        id: 'note',
        header: 'Catatan',
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor('actions', {
      header: '',
      cell: (info) => (
        <div className="relative ml-4" ref={ref}>
          <div
            className="cursor-pointer"
            onClick={() => handleMenuToggle(info.row.id)}
          >
            <IconKebab size={20} />
          </div>
          {actionMenu === info.row.id && (
            <div
              className="absolute z-100 bg-white border border-gray-300 rounded shadow-lg mt-1 right-0 w-50"
              style={{ zIndex: 1000 }}
            >
              <button
                onClick={() => {
                  // handle mark transaction action here
                  setActionMenu(null)
                  setSelected({} as TransactionData)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {info.row.original.isHighlight
                  ? 'Hapus Tanda'
                  : 'Tandai Transaksi'}
              </button>
              <button
                onClick={() => {
                  setSelected(info.row.original)
                  setIsOpenCategoryModal(true)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Ubah Kategori
              </button>
              <button
                onClick={() => {
                  setSelected(info.row.original)
                  setIsOpen(true)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Ubah Catatan
              </button>
              <button
                onClick={() => {
                  setSelected(info.row.original)
                  setIsOpenVerifModal(true)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Verifikasi Info Bank Transaksi
              </button>
            </div>
          )}
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (selected.id) {
      setActionMenu(null)
    }
  }, [selected.id])

  return (
    <>
      <TransactionCategoryModal
        isOpen={isOpenCategoryModal}
        onClose={() => {
          setIsOpenCategoryModal(false)
          setSelected({} as TransactionData)
        }}
      />
      <Modal
        isOpen={isOpenVerfiModal}
        onClose={() => setIsOpenVerifModal(false)}
      >
        <h2 className="font-semibold text-lg">
          Konfirmasi Pengecekan Rekening
        </h2>
        <div className="mt-2">
          Apakah pengecekan informasi rekening transaksi akan dilakukan?
        </div>
        <div className="text-xs mt-3 text-gray-500">
          *Pengecekan ini bekerja sama dengan mitra pihak ketiga dan mungkin
          dikenakan biaya tambahan.
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => {
              setIsOpenVerifModal(false)
              setSelected({} as TransactionData)
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={() => {
              // hit BE API
              setIsOpenVerifModal(false)
              setSelected({} as TransactionData)
            }}
            className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
          >
            Cek
          </button>
        </div>
      </Modal>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-lg font-semibold mb-4">Catatan</h2>
        <textarea
          value={selected.note}
          onChange={(e) => {
            const value = e.target.value
            setSelected({
              ...selected,
              note: value,
            })
          }}
          className="w-full text-sm h-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Masukkan catatan..."
        />
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => {
              onClose()
              setSelected({} as TransactionData)
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={() => {
              // hit patch api
              setIsOpen(false)
              setSelected({} as TransactionData)
            }}
            className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
          >
            Simpan
          </button>
        </div>
      </Modal>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TransactionTable
