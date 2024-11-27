import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  ColumnSort,
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
import Button from '@/components/Button'
import { ITransactionItem } from '../../TransactionList'
import { thousandSeparator } from '@/utils/thousanSeparator'

const columnHelper = createColumnHelper<ITransactionItem & { actions: any }>()

const iconBankMap = {
  BCA: <IconBCA size={24} />,
  BRI: <IconBRI size={24} />,
  BNI: <IconBNI size={24} />,
  MANDIRI: <IconMandiri size={24} />,
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
  setSortBy,
  setSortDir,
}: {
  setSortBy: Dispatch<SetStateAction<string | undefined>>
  setSortDir: Dispatch<SetStateAction<'asc' | 'desc' | undefined>>
  token: string
  refetch: () => void
  transactionList: Array<ITransactionItem>
  isLoading: boolean
}) => {
  const { id } = useParams()
  const refDropdown = useRef(null)
  const [selected, setSelected] = useState({} as ITransactionItem)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenVerfiModal, setIsOpenVerifModal] = useState(false)
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false)
  const [isOpenDestBankModal, setIsOpenDestBankModal] = useState(false)
  const [sorting, setSorting] = useState<ColumnSort[]>([])

  useEffect(() => {
    setSortBy(sorting[0]?.id)
    setSortDir(sorting[0]?.desc ? 'desc' : 'asc')
  }, [sorting])

  useOutsideClick(refDropdown, () => {
    setSelected({} as ITransactionItem)
    setActionMenu('')
  })

  const handleMenuToggle = (id: string) => {
    setActionMenu((prev) => (prev === id ? null : id))
  }

  const { mutate } = useMutation({
    mutationFn: (payload: { is_starred: boolean; transactionId: string }) =>
      axiosInstance.patch(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${payload.transactionId}/is-starred`,
        {
          is_starred: payload.is_starred,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => (
          <div>
            <div className="text-xs">{row.date}</div>
            {row.time && (
              <div className="text-[11px]">
                {dayjs(row.time).format('HH:mm:ss')}
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
              {iconBankMap[row.owner_bank as 'BNI' | 'BCA' | 'BRI' | 'MANDIRI']}
              <div className="text-xs max-w-[10rem] break-words whitespace-pre-wrap">
                <div className="text-xs">{`${
                  row.owner_bank || 'unnamed'
                }`}</div>
                <div className="text-xs">{`${row.owner_name || 'unknown'} - ${
                  row.owner_account_number || 'N/A'
                }`}</div>
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
      columnHelper.accessor('method', {
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
            <div className="text-xs">
              {row.entity_bank_adjusted
                ? row.entity_bank_adjusted || 'unknown'
                : row.entity_bank || 'unknown'}
            </div>
            <div className="text-xs">{`${
              row.entity_account_number_adjusted
                ? row.entity_account_number_adjusted || 'N/A'
                : row.entity_account_number || 'N/A'
            } - ${
              row.entity_name_adjusted
                ? row.entity_name_adjusted || 'unnamed'
                : row.entity_name || 'unnamed'
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
            {row.direction === 'OUT' && (
              <span
                className="rounded p-2 py-1 text-[#B71D18] font-bold text-xs"
                style={{ background: 'rgba(255, 86,48, 0.2)' }}
              >
                Db
              </span>
            )}
            {row.direction === 'IN' && (
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
        cell: (info) => info.getValue() || 'IDR',
        enableSorting: false,
      }),
      columnHelper.accessor('description', {
        header: 'Remark',
        cell: (info) => (
          <div className="text-xs max-w-[10rem] break-words whitespace-pre-wrap capitalize">
            {info.getValue().toLowerCase() || '-'}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor(
        (row) => (
          <div className="text-xs">
            {row.category_name_adjusted
              ? row.category_name_adjusted || '-'
              : row.category_name || '-'}
          </div>
        ),
        {
          id: 'category_name',
          header: 'Kategori',
          cell: (info) => info.getValue(),
          enableSorting: false,
        }
      ),
      columnHelper.accessor('balance', {
        header: 'Nominal Transkasi',
        cell: (info) => (
          <div className="text-xs">
            {thousandSeparator(info.getValue() || 0)}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('balance', {
        header: 'Saldo',
        cell: (info) => (
          <div className="text-xs">
            {thousandSeparator(info.getValue() || 0)}
          </div>
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
                    mutate(
                      {
                        is_starred: !info.row.original.is_starred,
                        transactionId: info.row.original.transaction_id,
                      },
                      {
                        onSuccess: () => {
                          toast.success('Berhasil memperbarui tanda')
                          setSelected({} as ITransactionItem)
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
                    setSelected({} as ITransactionItem)
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {info.row.original.is_starred
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
    ],
    [actionMenu, mutate, refetch]
  )

  const table = useReactTable({
    data: transactionList as Array<ITransactionItem & { actions: any }>,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting as any,
  })

  useEffect(() => {
    if (selected.transaction_id) {
      setActionMenu(null)
    }
  }, [selected.transaction_id])

  const { mutate: verifyBank, isPending: isPendingVerif } = useMutation({
    mutationFn: () =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${id}/entity/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  return (
    <>
      <TransactionBankDestModal
        transactionId={selected.transaction_id}
        token={token}
        isOpen={isOpenDestBankModal}
        setIsOpenDestBankModal={setIsOpenDestBankModal}
        selected={selected}
        onClose={() => {
          refetch()
          setIsOpenDestBankModal(false)
          setSelected({} as ITransactionItem)
        }}
      />
      <TransactionCategoryModal
        category={selected.category_name}
        refetch={refetch}
        transactionId={selected.transaction_id}
        token={token}
        isOpen={isOpenCategoryModal}
        setIsOpenCategoryModal={setIsOpenCategoryModal}
        onClose={() => {
          refetch()
          setSelected({} as ITransactionItem)
          setIsOpenCategoryModal(false)
        }}
      />
      <Modal
        isOpen={isOpenVerfiModal}
        onClose={() => setIsOpenVerifModal(false)}
      >
        {(selected.entity_account_number ||
          selected.entity_account_number_adjusted) &&
        (selected.entity_bank || selected.entity_bank_adjusted) ? (
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
                  setSelected({} as ITransactionItem)
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <Button
                loading={isPendingVerif}
                variant="dark"
                onClick={() => {
                  verifyBank(undefined, {
                    onSuccess: () => {
                      toast.success('Berhasil mengecek info rekening transaksi')
                      setIsOpenVerifModal(false)
                      setSelected({} as ITransactionItem)
                      refetch()
                    },
                    onError: (error: any) => {
                      setIsOpenVerifModal(false)
                      setSelected({} as ITransactionItem)
                      toast.error(
                        `Gagal mengecek info rekening transaksi: ${error?.response?.data?.message}`
                      )
                    },
                  })
                }}
              >
                Cek
              </Button>
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
                  setSelected({} as ITransactionItem)
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
        transactionId={selected.transaction_id}
        token={token}
        setIsOpen={setIsOpen}
        initialNote={selected.note}
        isOpen={isOpen}
        onClose={() => {
          refetch()
          setIsOpen(false)
          setSelected({} as ITransactionItem)
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
                      } ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
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
                      row.original.is_starred ? 'bg-orange-50' : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={`${row.id}-${i}`}
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

          {!isLoading && (
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
          )}
        </div>
      </div>
    </>
  )
}

export default TransactionTable
