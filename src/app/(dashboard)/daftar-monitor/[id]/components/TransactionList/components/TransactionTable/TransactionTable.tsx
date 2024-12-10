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
  IconChecklist,
  IconQMark,
} from '@/icons'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnSort,
} from '@tanstack/react-table'
import { Shimmer } from '@/components'
import TransactionCategoryModal from '../TransactionCategoryModal'
import { colorToken } from '@/constants/color-token'
import dayjs from 'dayjs'
import TransactionBankDestModal from '../TransactionBankDestModal'
import useOutsideClick from '@/utils/useClickOutside'
import TransactionNoteModal from '../TransactionNoteModal/TransactionNoteModal'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'

import toast from 'react-hot-toast'
import { ITransactionItem } from '../../TransactionList'
import { thousandSeparator } from '@/utils/thousanSeparator'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import TransactionVerifyAccountModal from '../TransactionVerifyAccountModal'

const columnHelper = createColumnHelper<ITransactionItem & { actions: any }>()

const iconBankMap = {
  BCA: <IconBCA size={40} />,
  BRI: <IconBRI size={40} />,
  BNI: <IconBNI size={40} />,
  MANDIRI: <IconMandiri size={40} />,
}

const NoteCell = ({ text, baseUrl }: { text: string; baseUrl: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <div className="text-xs max-w-[7rem] break-words whitespace-pre-wrap">
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
  baseUrl,
  token,
  transactionList,
  refetch,
  isLoading,
  setSortBy,
  setSortDir,
  verifyBankAccount,
}: {
  baseUrl: string
  setSortBy: Dispatch<SetStateAction<string | undefined>>
  setSortDir: Dispatch<SetStateAction<'asc' | 'desc' | undefined>>
  token: string
  refetch: () => void
  transactionList: Array<ITransactionItem>
  isLoading: boolean
  verifyBankAccount: ({
    transaction_id,
    entity_name,
    entity_account_number,
    entity_bank,
    currency,
  }: {
    transaction_id: string
    entity_name: string
    entity_account_number: string
    entity_bank: string
    currency: string
  }) => Promise<{ isSuccess: boolean; error?: string; data?: any }>
}) => {
  const refDropdown = useRef(null)
  const [selected, setSelected] = useState({} as ITransactionItem)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenVerifModal, setIsOpenVerifModal] = useState(false)
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
            {row.time && <div className="text-[11px]">{row.time}</div>}
          </div>
        ),
        {
          id: 'date',
          header: 'Waktu',
          cell: (info) => (
            <div className="text-xs">
              {dayjs(new Date(info.row.original.date)).format('DD/MM/YYYY')}
            </div>
          ),
          enableSorting: true,
        }
      ),
      columnHelper.accessor(
        (row) => (
          <div>
            <div className="flex gap-2 mt-2 items-center">
              {iconBankMap[row.owner_bank as 'BNI' | 'BCA' | 'BRI' | 'MANDIRI']}
              <div className="text-xs max-w-[7rem] break-words whitespace-pre-wrap">
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
          id: 'owner_account_id',
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
          <div className="text-xs max-w-[7rem] break-words whitespace-pre-wrap capitalize">
            {info.getValue().toLowerCase() || 'unknown'}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor(
        (row) => (
          <div className="text-xs max-w-[7rem] break-words whitespace-pre-wrap">
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
          id: 'entity_account_number',
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
          id: 'direction',
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

      columnHelper.accessor(
        (row) => (
          <div className="text-xs max-w-[5rem] break-words whitespace-pre-wrap">
            {row.category_name_adjusted
              ? row.category_name_adjusted || 'unknown'
              : row.category_name || 'unknown'}
          </div>
        ),
        {
          id: 'category_name',
          header: 'Kategori',
          cell: (info) => (
            <div className="text-xs max-w-[5rem] break-words whitespace-pre-wrap">
              {info.getValue()}
            </div>
          ),
          enableSorting: false,
        }
      ),
      columnHelper.accessor('description', {
        header: 'Remark',
        cell: (info) => (
          <div className="text-xs max-w-[5rem] break-words whitespace-pre-wrap capitalize">
            {info.getValue().toLowerCase() || '-'}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('is_entity_verified', {
        header: 'Verifikasi Rekening',
        cell: (info) =>
          info.getValue() ? (
            <>
              <Tooltip
                id={info.row.original.transaction_id}
                place="bottom"
                content={`${info.row.original.entity_name_verified} - ${info.row.original.entity_bank_label_verified} ${info.row.original.entity_account_number_verified}`}
              />
              <div
                className="flex justify-center cursor-pointer"
                data-tooltip-id={info.row.original.transaction_id}
              >
                <IconChecklist color={colorToken.greenBullish} size={20} />
              </div>
            </>
          ) : (
            <div
              className="flex justify-center cursor-pointer"
              data-tooltip-id={info.row.original.transaction_id}
            >
              <IconQMark color={colorToken.orangeJeruk} size={20} />
            </div>
          ),
        enableSorting: false,
      }),
      columnHelper.accessor('amount', {
        header: 'Nominal Transaksi',
        cell: (info) => (
          <div className="text-xs">
            {thousandSeparator(info.getValue() || 0)}
          </div>
        ),
        enableSorting: false,
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
      columnHelper.accessor(
        (row) => <NoteCell text={row.note || ''} baseUrl={baseUrl} />,
        {
          id: 'note',
          header: 'Catatan',
          cell: (info) => info.getValue(),
          enableSorting: false,
        }
      ),
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
                    setSelected(info.row.original)
                    setIsOpenVerifModal(true)
                    setActionMenu(null)
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Cek Rekening
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
                    setIsOpenDestBankModal(true)
                    setActionMenu(null)
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Ubah Info Lawan Transaksi
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

  return (
    <>
      <TransactionBankDestModal
        baseUrl={baseUrl}
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
        baseUrl={baseUrl}
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
      <TransactionVerifyAccountModal
        isOpen={isOpenVerifModal}
        setIsOpenVerifModal={setIsOpenVerifModal}
        selected={selected}
        verifyBankAccount={verifyBankAccount}
        refetch={refetch}
        setSelected={setSelected}
        token={token}
        baseUrl={baseUrl}
      />

      <TransactionNoteModal
        baseUrl={baseUrl}
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
                    className={` hover:bg-gray-100 transition-colors duration-300 ${
                      row.original.is_starred ? 'bg-orange-50' : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={`${row.id}-${i}`}
                        className={`${
                          cell.column.id === 'actions' ? 'relative' : ''
                        } px-2 py-2 whitespace-nowrap text-sm text-gray-800 `}
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
