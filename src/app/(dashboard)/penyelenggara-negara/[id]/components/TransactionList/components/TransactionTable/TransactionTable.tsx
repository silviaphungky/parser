import { ReactNode, useEffect, useRef, useState } from 'react'
import {
  IconBCA,
  IconBNI,
  IconBRI,
  IconTriangleDown,
  IconKebab,
  IconMandiri,
} from '@/icons'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Modal, Shimmer } from '@/components'
import TransactionCategoryModal from '../TransactionCategoryModal'
import { colorToken } from '@/constants/color-token'
import dayjs from 'dayjs'
import TransactionBankDestModal from '../TransactionBankDestModal'
import useOutsideClick from '@/utils/useClickOutside'
import TransactionNoteModal from '../TransactionNoteModal/TransactionNoteModal'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { baseUrl } from '../../../UploadBankStatement/UploadBankStatement'
import { API_URL } from '@/constants/apiUrl'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export type TransactionData = {
  id: string
  index: number
  personalBankName: string
  personalBankAccNo: string
  personalBankAccName: string
  transactionDate: string
  transactionTime?: string
  remark: string
  transactionMethod: string
  targetBankAccNo: string
  targetBankAccName: string
  targetBankName: string
  currency: string
  creditDebit: 'credit' | 'debit'
  mutation: number
  balance: number
  note?: string
  isHighlight: boolean
  isFamily: boolean
  category: {
    id: string
    label: string
  }
}

const defaultData: Array<TransactionData & { actions: boolean }> = [
  {
    id: '1',
    index: 1,
    personalBankName: 'BNI',
    personalBankAccNo: '1234567890',
    personalBankAccName: 'Siti Aisyah',
    transactionDate: '2024-10-01',
    remark: 'Transfer to BCA',
    transactionMethod: 'Transfer Bank',
    targetBankAccNo: '9876543210',
    targetBankAccName: 'John Doe',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 2000000,
    balance: 10000000,
    note: 'transaksi ini terindikasi pelanggaran berat sehingga perlu ditandai',
    isHighlight: true,
    actions: true,
    category: {
      id: '1',
      label: 'belanja',
    },
    isFamily: true,
  },
  {
    id: '2',
    index: 2,
    personalBankName: 'BCA',
    personalBankAccNo: '2345678901',
    personalBankAccName: 'Gumilar',
    transactionDate: '2024-10-03',
    remark: 'Salary Credit',
    transactionMethod: 'Pembayaran Kartu (Debit/Kredit)',
    targetBankAccNo: '',
    targetBankAccName: '',
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
    isFamily: false,
  },
  {
    id: '3',
    index: 3,
    personalBankName: 'Mandiri',
    personalBankAccNo: '3456789012',
    personalBankAccName: 'Gumilar',
    transactionDate: '2024-10-05',
    transactionTime: `${new Date()}`,
    remark: 'Payment to Vendor',
    transactionMethod: 'Dompet Digital',
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
    isFamily: false,
  },
  {
    id: '4',
    index: 4,
    personalBankName: 'BRI',
    personalBankAccNo: '4567890123',
    personalBankAccName: 'Gumilar',
    transactionDate: '2024-10-07',
    remark: 'Refund',
    transactionMethod: 'Pembayaran dengan Kode QR',
    targetBankAccNo: '',
    targetBankAccName: '',
    targetBankName: 'BNI',
    currency: 'IDR',
    creditDebit: 'credit',
    mutation: 1500000,
    balance: 13500000,
    note: 'transaksi ini aman',
    isHighlight: false,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
    isFamily: false,
  },
  {
    id: '5',
    index: 5,
    personalBankName: 'BNI',
    personalBankAccNo: '5678901234',
    personalBankAccName: 'Gumilar',
    transactionDate: '2024-10-10',
    remark: 'Transfer to Mandiri',
    transactionMethod: 'Transaksi Tunai (termasuk ATM)',
    targetBankAccNo: '6789012345',
    targetBankAccName: 'Alice Wong',
    targetBankName: 'Mandiri',
    currency: 'IDR',
    creditDebit: 'debit',
    mutation: 4000000,
    balance: 9500000,
    note: '',
    isHighlight: true,
    actions: true,
    category: {
      id: '2',
      label: 'investasi',
    },
    isFamily: false,
  },
  {
    id: '6',
    index: 6,
    personalBankName: 'Mandiri',
    personalBankAccNo: '6789012345',
    personalBankAccName: 'Gumilar',
    transactionDate: '2024-10-12',
    remark: 'Bill Payment',
    transactionMethod: 'Tidak Diketahui (Unknown)',
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
    isFamily: false,
  },
]

const columnHelper = createColumnHelper<TransactionData & { actions: any }>()

const iconBankMap = {
  BCA: <IconBCA size={24} />,
  BRI: <IconBRI size={24} />,
  BNI: <IconBNI size={24} />,
  Mandiri: <IconMandiri size={24} />,
}

const NoteCell = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <div className="text-xs max-w-[10rem] break-words whitespace-pre-wrap">
      <div className={`overflow-hidden ${isExpanded ? '' : 'max-h-8'}`}>
        {isExpanded
          ? text
          : `${text.slice(0, 49)} ${
              text.length > 30 && !isExpanded ? '...' : ''
            }`}
      </div>
      {text && text.length >= 50 && (
        <button
          onClick={toggleExpand}
          className="text-blue-500 cursor-pointer hover:underline mt-1 text-xs"
        >
          {isExpanded ? 'Lebih sedikit' : 'Lebih banyak'}
        </button>
      )}
    </div>
  )
}

const TransactionTable = ({
  token,
  transactionList,
  refetch,
  isLoading,
}: {
  token: string
  refetch: () => void
  transactionList: Array<{}>
  isLoading: boolean
}) => {
  const { id } = useParams()
  const refDropdown = useRef(null)
  const [selected, setSelected] = useState({} as TransactionData)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenVerfiModal, setIsOpenVerifModal] = useState(false)
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false)
  const [isOpenDestBankModal, setIsOpenDestBankModal] = useState(false)
  const [sorting, setSorting] = useState([])
  useOutsideClick(refDropdown, () => {
    setSelected({} as TransactionData)
    setActionMenu('')
  })

  const handleMenuToggle = (id: string) => {
    setActionMenu((prev) => (prev === id ? null : id))
  }

  const { mutate } = useMutation({
    mutationFn: (payload: { is_starred: boolean }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${id}/is-starred`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const columns = [
    columnHelper.accessor(
      (row) => (
        <div>
          <div className="text-xs">{row.transactionDate}</div>
          {row.transactionTime && (
            <div className="text-[11px]">
              {dayjs(row.transactionTime).format('HH:mm:ss')}
            </div>
          )}
        </div>
      ),
      {
        id: 'transactionDate',
        header: 'Waktu',
        cell: (info) => info.getValue(),
        enableSorting: true,
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
            <div className="text-xs max-w-[10rem] break-words whitespace-pre-wrap">
              <div className="text-xs">{`${row.personalBankName}`}</div>
              <div className="text-xs">{`${row.personalBankAccName} - ${row.personalBankAccNo}`}</div>
            </div>
          </div>
        </div>
      ),
      {
        id: 'personalBankInfo',
        header: 'Info Bank PN',
        cell: (info) => info.getValue(),
        enableSorting: false,
      }
    ),

    columnHelper.accessor('transactionMethod', {
      header: (
        <div>
          <div>Metode</div>
          <div>Transaksi</div>
        </div>
      ) as any,
      cell: (info) => (
        <div className="text-xs max-w-[10rem] break-words whitespace-pre-wrap">
          {info.getValue()}
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor(
      (row) => (
        <div className="text-xs max-w-[10rem] break-words whitespace-pre-wrap">
          <div className="text-xs">{row.targetBankName || 'unknown'}</div>
          <div className="text-xs">{`${row.targetBankAccNo || 'N/A'} - ${
            row.targetBankAccName || 'unnamed'
          }`}</div>
        </div>
      ),
      {
        id: 'targetBankInfo',
        header: 'Info Lawan Transaksi',
        cell: (info) => info.getValue(),
        enableSorting: false,
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
        enableSorting: false,
      }
    ),
    columnHelper.accessor('currency', {
      header: 'Mata Uang',
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor('remark', {
      header: 'Remark',
      cell: (info) => <div className="text-xs">{info.getValue()}</div>,
      enableSorting: false,
    }),
    columnHelper.accessor('category.label', {
      header: 'Kategori',
      cell: (info) => <div className="text-xs">{info.getValue()}</div>,
      enableSorting: false,
    }),
    columnHelper.accessor('mutation', {
      header: 'Nominal Transkasi',
      cell: (info) => (
        <div className="text-xs">{info.getValue().toLocaleString()}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('balance', {
      header: 'Saldo',
      cell: (info) => (
        <div className="text-xs">{info.getValue().toLocaleString()}</div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor((row) => <NoteCell text={row.note || ''} />, {
      id: 'note',
      header: 'Catatan',
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor('actions', {
      header: '',
      cell: (info) => (
        <div className="relative ml-4">
          <div
            className="cursor-pointer"
            onClick={() => handleMenuToggle(info.row.id)}
          >
            <IconKebab size={20} />
          </div>
          {actionMenu === info.row.id && (
            <div
              ref={refDropdown}
              className="absolute z-100 bg-white border border-gray-300 rounded shadow-lg mt-1 right-0 w-50"
              style={{ zIndex: 1000 }}
            >
              <button
                onClick={() => {
                  // handle mark transaction action here
                  // NOTE: TERGANTUNG BALIKAN BE
                  mutate(
                    {
                      is_starred: false,
                    },
                    {
                      onSuccess: () => {
                        toast.success('Berhasil memperbarui tanda')
                        setSelected({} as TransactionData)
                        setActionMenu(null)
                        refetch()
                      },
                      onError: (error: any) => {
                        toast.error(
                          `Gagal memperbarui tanda: ${error?.response?.data?.message}`
                        )
                      },
                    }
                  )
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
                  setIsOpen(true)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Ubah Catatan
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
                  setIsOpenDestBankModal(true)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Ubah Info Lawan Transaksi
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
      enableSorting: false,
    }),
  ]

  const table = useReactTable({
    data: defaultData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting as any,
  })

  useEffect(() => {
    if (selected.id) {
      setActionMenu(null)
    }
  }, [selected.id])

  return (
    <>
      <TransactionBankDestModal
        token={token}
        isOpen={isOpenDestBankModal}
        setIsOpenDestBankModal={setIsOpenDestBankModal}
        selected={selected}
        onClose={() => {
          refetch()
          setIsOpenDestBankModal(false)
          setSelected({} as TransactionData)
        }}
      />
      <TransactionCategoryModal
        token={token}
        isOpen={isOpenCategoryModal}
        setIsOpenCategoryModal={setIsOpenCategoryModal}
        onClose={() => {
          refetch()
          setSelected({} as TransactionData)
          setIsOpenCategoryModal(false)
        }}
      />
      <Modal
        isOpen={isOpenVerfiModal}
        onClose={() => setIsOpenVerifModal(false)}
      >
        {selected.targetBankAccNo && selected.targetBankName ? (
          <>
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
          </>
        ) : (
          <>
            <h2 className="font-semibold text-lg">Verifikasi Nomor Rekening</h2>
            <div className="mt-2 text-sm">
              Verifikasi nomor rekening hanya bisa dilakukan untuk transaksi
              yang memiliki informasi institusi dan nomor rekening pihak lawan
              transaksi
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  // hit BE API
                  setIsOpenVerifModal(false)
                  setSelected({} as TransactionData)
                }}
                className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
              >
                Mengerti
              </button>
            </div>
          </>
        )}
      </Modal>

      <TransactionNoteModal
        token={token}
        setIsOpen={setIsOpen}
        initialNote={selected.note}
        isOpen={isOpen}
        onClose={() => {
          refetch()
          setIsOpen(false)
          setSelected({} as TransactionData)
        }}
      />

      <div className="p-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="font-semibold bg-gray-100 relative z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`sticky top-0 px-2 py-3 text-left text-sm font-semibold capitalize tracking-wider  cursor-pointer ${
                        header.column.getIsSorted()
                          ? 'bg-gray-200'
                          : 'bg-gray-100'
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex gap-2 items-center justify-between">
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
                    className={`hover:bg-gray-100 transition-colors duration-300 ${
                      row.original.isHighlight ? 'bg-orange-50' : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-2 py-2 whitespace-nowrap text-sm text-gray-800 `}
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
          {/*NOTE: temporary comment */}
          {/* {!isLoading && (
            <>
              {transactionList.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-lg font-medium">
                    Tidak ada data yang tersedia
                  </p>
                  <p className="text-sm">Tambahkan laporan bank.</p>
                </div>
              )}
            </>
          )} */}
        </div>
      </div>
    </>
  )
}

export default TransactionTable
