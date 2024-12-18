'use client'

import * as yup from 'yup'
import {
  ColumnSort,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { numberAbbv } from '@/utils/numberAbbv'
import {
  IconArchieve,
  IconExpand,
  IconKebab,
  IconLink,
  IconTriangleDown,
} from '@/icons'
import Link from 'next/link'
import { FormItem, Input, InputSearch, Modal, Shimmer } from '@/components'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputDropdown from '@/components/InputDropdown'
import { colorToken } from '@/constants/color-token'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import toast, { Toaster } from 'react-hot-toast'
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import AsyncSelect from 'react-select/async'
import dayjs from 'dayjs'
import useOutsideClick from '@/utils/useClickOutside'
import axiosInstance from '@/utils/axiosInstance'
import Button from '@/components/Button'

export type Person = {
  account_reporter_id: string
  name: string
  nik: string
}

interface FormValues {
  familyName: {
    value: string
    label: string
  }
  child_family_role: {
    id: string
    label: string
  }
  parent_family_role: {
    id: string
    label: string
  }
  childOtherRole?: string
  parentOtherRole?: string
}

// Role options
const roleOptions = [
  { id: 'children', label: 'Anak' },
  { id: 'wife/husband', label: 'Suami/Istri' },
  { id: 'sister/brother', label: 'Saudara Kandung' },
  { id: 'parents', label: 'Orang Tua' },
  { id: 'other', label: 'Lainnya' },
]

// Validation schema
const validationSchema = yup.object().shape({
  familyName: yup.object({
    value: yup.string().required(),
    label: yup.string().required('Identitas keluarga wajib dipilih'),
  }),
  parent_family_role: yup.object({
    id: yup.string().required(),
    label: yup.string().required('Hubungan wajib diisi'),
  }),
  child_family_role: yup.object({
    id: yup.string().required(),
    label: yup.string().required('Hubungan wajib diisi'),
  }),
  parentOtherRole: yup.string().when('parent_famliy_role.id', {
    is: (val: string) => val === 'other',
    then: () => yup.string().required('Detail hubungan wajib diisi'),
    otherwise: () => yup.string(),
  }),
  childOtherRole: yup.string().when('child_famliy_role.id', {
    is: (val: string) => val === 'other',
    then: () => yup.string().required('Detail hubungan wajib diisi'),
    otherwise: () => yup.string(),
  }),
})

const columnHelper = createColumnHelper<
  {
    id: string
    name: string
    nik: string
    bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
    total_statement: number
    total_transaction: number
    total_family_member: number
    created_at: string
    updated_at?: string
    total_bank_account: number
    total_asset?: Array<{
      [key: string]: number
    }>
  } & { action: string }
>()

const notify = () => toast.success('Daftar Monitor berhasil diarsipkan')
const notifyLink = () => toast.success('Relasi keluarga berhasil ditambahkan')

const PNTable = ({
  baseUrl,
  isLoading,
  pnList,
  token,
  refetch,
  setKeyword,
  setSortBy,
  setSortDir,
}: {
  baseUrl: string
  setSortBy: Dispatch<SetStateAction<string | undefined>>
  setSortDir: Dispatch<SetStateAction<'asc' | 'desc' | undefined>>
  isLoading: boolean
  pnList: Array<{
    id: string
    name: string
    nik: string
    bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
    total_statement: number
    total_transaction: number
    total_family_member: number
    created_at: string
    updated_at?: string
    total_bank_account: number
    total_asset?: Array<{
      [key: string]: number
    }>
  }>
  token: string
  refetch: () => void
  setKeyword: Dispatch<SetStateAction<string>>
}) => {
  const ref = useRef(null)
  const [search, setSearch] = useState('')
  const [isOpenFamilyForm, setIsOpenFamilyForm] = useState(false)
  const [isOpenRemove, setIsOpenRemove] = useState(false)
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  })

  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [selectedPn, setSelectedPn] = useState(
    {} as {
      id: string
      name: string
      nik: string
      bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
      total_statement: number
      total_transaction: number
      total_family_member: number
      created_at: string
      updated_at?: string
      total_bank_account: number
      total_asset?: Array<{
        [key: string]: number
      }>
    }
  )
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const refDropdown = useRef(null)

  const { mutate } = useMutation({
    mutationFn: (payload: { id: string }) =>
      axiosInstance.patch(
        `${baseUrl}/${API_URL.ARCHIVE_ACCOUNT_REPORTER}`,
        {
          id: payload.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const { mutate: linkFamily, isPending } = useMutation({
    mutationFn: (payload: {
      parent_account_reporter_id: string
      child_account_reporter_id: string
      parent_family_role: string
      child_family_role: string
    }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.LINK_FAMILY}`,
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

  const selectedParentRole =
    useWatch({
      name: 'parent_family_role',
      control,
    }) || {}

  const selectedChildRole =
    useWatch({
      name: 'child_family_role',
      control,
    }) || {}

  const handleLinkFamily = (data: FormValues) => {
    linkFamily(
      {
        parent_account_reporter_id: selectedPn.id,
        child_account_reporter_id: data.familyName.value,
        parent_family_role:
          data.parent_family_role.id === 'other'
            ? (data.parentOtherRole as string)
            : data.parent_family_role.label,
        child_family_role:
          data.child_family_role.id === 'other'
            ? (data.childOtherRole as string)
            : data.child_family_role.label,
      },
      {
        onSuccess: () => {
          refetch()
          notifyLink()
          setIsOpenFamilyForm(false)
          reset()
        },
        onError: (error: any) => {
          const isConflict = error.status === 409

          if (isConflict) {
            toast.error(
              `Daftar Monitor telah terhubung dengan ${data.familyName.label}`
            )
          }
        },
      }
    )
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span>Nama</span>,
        cell: (info) => {
          return (
            <div className="text-sm max-w-[18rem] break-words whitespace-pre-wrap font-semibold capitalize">
              {info.getValue().toLowerCase()}
            </div>
          )
        },
      }),
      columnHelper.accessor('nik', {
        header: () => <span>NIK</span>,
        cell: (info) => {
          return <div>{info.getValue()}</div>
        },
        enableSorting: true,
      }),
      columnHelper.accessor('total_family_member', {
        header: () => (
          <div className="text-right">
            <div>Jumlah Relasi Keluarga</div>
          </div>
        ),
        cell: (info) => {
          return <div className="text-right text-sm">{info.getValue()}</div>
        },
      }),
      columnHelper.accessor('total_bank_account', {
        header: () => (
          <div className="text-right">
            <div>Jumlah Akun Bank</div>
          </div>
        ),
        cell: (info) => {
          return (
            <div className="text-sm text-right">{info.getValue() || 0}</div>
          )
        },
      }),
      columnHelper.accessor('total_statement', {
        header: () => (
          <div className="text-right">
            <div>Jumlah Laporan Bank</div>
          </div>
        ),
        cell: (info) => {
          return (
            <div className="text-sm text-right">
              {thousandSeparator(info.getValue())}
            </div>
          )
        },
        enableSorting: true,
      }),
      // columnHelper.accessor('total_transaction', {
      //   header: () => <span>Jumlah Transaksi</span>,
      //   cell: (info) => {
      //     return (
      //       <div className="text-sm text-right">
      //         {thousandSeparator(info.getValue())}
      //       </div>
      //     )
      //   },
      // }),
      // columnHelper.accessor(
      //   (row) =>
      //     row.total_asset?.map((obj) => {
      //       const key = Object.keys(obj)[0]
      //       const item = obj[key]
      //       return (
      //         <div className="text-sm" key={key}>
      //           {`${key} ${numberAbbv(item)}`}
      //         </div>
      //       )
      //     })
      //   // {
      //   //   id: 'total_asset',
      //   //   header: () => <span>Total Asset</span>,
      //   //   cell: (info) => {
      //   //     return info.getValue()
      //   //   },
      //   //   enableSorting: false,
      //   // }
      // ),
      columnHelper.accessor('created_at', {
        header: () => <span>Dibuat pada</span>,
        cell: (info) => {
          return (
            <div className="text-xs text-left">
              {dayjs(info.getValue()).format('DD/MM/YYYY') || '-'}
            </div>
          )
        },
      }),
      columnHelper.accessor('updated_at', {
        header: () => <span>Diperbarui pada</span>,
        cell: (info) => {
          return (
            <div className="text-xs text-left">
              {info.getValue()
                ? dayjs(new Date(info.getValue() as string)).format(
                    'DD/MM/YYYY HH:mm:ss'
                  )
                : '-'}
            </div>
          )
        },
      }),
      columnHelper.accessor('action', {
        header: () => <span></span>,
        cell: (info) => {
          return (
            <div className="relative ml-4" ref={ref}>
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
                  <Link
                    href={`/daftar-monitor/${info.row.original.id}/summary`}
                  >
                    <button className="w-full p-2 flex gap-2 text-left hover:bg-gray-100 items-center">
                      <IconExpand size={16} color={colorToken.grayVulkanik} />
                      <div className="text-sm">Lihat detail</div>
                    </button>
                  </Link>

                  <button
                    className="w-full p-2 flex gap-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setSelectedPn(info.row.original)
                      setIsOpenFamilyForm(true)
                      setActionMenu(null)
                    }}
                  >
                    <IconLink size={18} color={colorToken.grayVulkanik} />
                    <div className="text-sm">Hubungkan Keluarga</div>
                  </button>

                  <div>
                    <button
                      className="text-sm p-2 flex gap-2 w-full hover:bg-gray-100"
                      onClick={() => {
                        setSelectedPn(info.row.original)
                        setIsOpenRemove(true)
                        setActionMenu(null)
                      }}
                    >
                      <IconArchieve color="#FE888F" size={20} />
                      <div className="text-sm">Arsipkan</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        },
        enableSorting: false,
      }),
    ],
    [actionMenu]
  )

  const handleMenuToggle = (id: string) => {
    setActionMenu((prev) => (prev === id ? null : id))
  }

  useOutsideClick(refDropdown, () => {
    setSelectedPn(
      {} as {
        id: string
        name: string
        nik: string
        bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
        total_statement: number
        total_transaction: number
        total_family_member: number
        created_at: string
        updated_at?: string
        total_bank_account: number
        total_asset?: Array<{
          [key: string]: number
        }>
      }
    )
    setActionMenu('')
  })

  const table = useReactTable({
    data: pnList as Array<
      {
        id: string
        name: string
        nik: string
        bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
        total_statement: number
        total_transaction: number
        total_family_member: number
        created_at: string
        updated_at?: string
        total_bank_account: number
        total_asset?: Array<{
          [key: string]: number
        }>
      } & { action: string }
    >,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
  })

  const handleSearch = (query: string) => {
    setKeyword(query)
  }

  useEffect(() => {
    setSortBy(sorting[0]?.id)
    setSortDir(sorting[0]?.desc ? 'desc' : 'asc')
  }, [sorting])

  const searchNIK = async (value: string) => {
    setSearch(value)
    const response = await fetch(
      `${baseUrl}/${API_URL.UNASSIGNED_LIST}?account_reporter_id=${selectedPn.id}&search=${value}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await response.json()
    const pn = data.data || {}
    const pnList = (pn.unassigned_family_list || []) as Array<{
      account_reporter_id: string
      name: string
      nik: string
    }>

    return pnList.map((item) => ({
      value: item.account_reporter_id,
      label: `${item.nik} - ${item.name}`,
    }))
  }

  return (
    <>
      <Modal
        width="max-w-[30rem]"
        isOpen={isOpenRemove}
        onClose={() => setIsOpenRemove(false)}
      >
        <h2 className="font-semibold mb-4 text-lg">Arsipkan Daftar Monitor</h2>
        <div className="mt-2 text-sm">
          Apakah Anda yakin mengarsipkan{' '}
          <strong>
            {selectedPn.name} - {selectedPn.nik}
          </strong>{' '}
          dari daftar monitoring?
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => {
              setSelectedPn(
                {} as {
                  id: string
                  name: string
                  nik: string
                  bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
                  total_statement: number
                  total_transaction: number
                  total_family_member: number
                  created_at: string
                  updated_at?: string
                  total_bank_account: number
                  total_asset?: Array<{
                    [key: string]: number
                  }>
                }
              )
              setIsOpenRemove(false)
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={() => {
              mutate(
                {
                  id: selectedPn.id,
                },
                {
                  onSuccess: () => {
                    notify()
                    refetch()
                    setIsOpenRemove(false)
                    setSelectedPn(
                      {} as {
                        id: string
                        name: string
                        nik: string
                        bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
                        total_statement: number
                        total_transaction: number
                        total_family_member: number
                        created_at: string
                        updated_at?: string
                        total_bank_account: number
                        total_asset?: Array<{
                          [key: string]: number
                        }>
                      }
                    )
                  },
                  onError: (error: any) => {
                    toast.error(
                      `Daftar Monitor gagal diarsipkan: ${error?.response?.data?.message}`
                    )
                  },
                }
              )
            }}
            className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
          >
            Arsipkan
          </button>
        </div>
      </Modal>

      <Modal
        width="max-w-[30rem]"
        isOpen={isOpenFamilyForm}
        onClose={() => {
          setIsOpenFamilyForm(false)
          reset()
        }}
      >
        <h2 className="font-semibold mb-4 text-lg">Hubungkan Keluarga</h2>
        <form onSubmit={handleSubmit(handleLinkFamily)}>
          <div>
            <Controller
              control={control}
              name="familyName"
              render={({ field, fieldState }) => (
                <FormItem
                  label="Identitas Keluarga"
                  errorMessage={fieldState.error?.message}
                >
                  <AsyncSelect
                    cacheOptions={true}
                    placeholder="Masukkan NIK atau nama keluarga..."
                    {...field}
                    loadOptions={searchNIK}
                    className="react-select-container"
                  />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="parent_family_role"
              render={({ field, fieldState }) => (
                <FormItem
                  label="Hubungan Daftar Monitor terhadap Keluarga"
                  errorMessage={fieldState.error?.message}
                >
                  <InputDropdown
                    {...field}
                    options={roleOptions}
                    placeholder="Pilih hubungan..."
                    errorMessage={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />
          </div>

          {selectedParentRole.id === 'other' && (
            <div>
              <Controller
                control={control}
                name="parentOtherRole"
                render={({ field, fieldState }) => (
                  <FormItem
                    label="Lainnya"
                    errorMessage={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      placeholder="Masukkan hubungan keluarga..."
                      className="w-full"
                      errorMessage={fieldState.error?.message}
                    />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div>
            <Controller
              control={control}
              name="child_family_role"
              render={({ field, fieldState }) => (
                <FormItem
                  label="Hubungan Keluarga terhadap Individu"
                  errorMessage={fieldState.error?.message}
                >
                  <InputDropdown
                    {...field}
                    options={roleOptions}
                    placeholder="Pilih hubungan..."
                    errorMessage={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />
          </div>

          {selectedChildRole.id === 'other' && (
            <div>
              <Controller
                control={control}
                name="childOtherRole"
                render={({ field, fieldState }) => (
                  <FormItem
                    label="Lainnya"
                    errorMessage={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      placeholder="Masukkan hubungan keluarga..."
                      className="w-full"
                      errorMessage={fieldState.error?.message}
                    />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="mt-8">
            <Button full loading={isPending} type="submit" variant="dark">
              Hubungkan Keluarga
            </Button>
          </div>
        </form>
      </Modal>

      <div className="mb-4 flex justify-between">
        <InputSearch
          onSearch={handleSearch}
          placeholder="Masukkan NIK atau Nama..."
        />
      </div>
      <div className="p-2">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="font-semibold bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="py-2">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`sticky top-0 px-2 py-3 text-left text-sm font-semibold capitalize tracking-wider bg-gray-100 ${
                      header.column.getIsSorted()
                        ? 'bg-gray-200'
                        : 'bg-gray-100'
                    } ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center justify-between gap-3">
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
            {pnList.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">
                  Tidak ada data yang tersedia
                </p>
                <p className="text-sm">
                  Tambahkan daftar monitor yang akan dipantau
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default PNTable
