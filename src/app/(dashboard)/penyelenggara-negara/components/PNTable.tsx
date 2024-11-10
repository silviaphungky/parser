'use client'

import * as yup from 'yup'
import {
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
  IconSort,
  IconTrash,
  IconTriangleDown,
  IconUnlink,
} from '@/icons'
import Link from 'next/link'
import { FormItem, Input, InputSearch, Modal } from '@/components'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputDropdown from '@/components/InputDropdown'
import { colorToken } from '@/constants/color-token'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from '@/constants/apiUrl'
import toast, { Toaster } from 'react-hot-toast'
import { useMemo, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import dayjs from 'dayjs'
import useOutsideClick from '@/utils/useClickOutside'
import useDebounce from '@/utils/useDebounce'

type Person = {
  id: string
  name: string
  nik: string
  bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
  total_statement: number
  total_transaction: number
  total_family_member: number
  total_asset?: Array<{
    [key: string]: number
  }>
  total_bank_account: number
  created_at: string
  updated_at?: string
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

const columnHelper = createColumnHelper<Person & { action: string }>()

const baseUrl = 'https://backend-itrtechkpk.replit.app'

const notify = () => toast.success('PN berhasil dihapus')
const notifyLink = () => toast.success('Relasi keluarga berhasil ditambahkan')

const PNTable = ({
  pnList,
  token,
  refetch,
}: {
  pnList: Array<Person>
  token: string
  refetch: () => void
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
    defaultValues: {
      role: {
        id: '',
        label: '',
      },
    },
  })
  console.log({ errors })
  const [sorting, setSorting] = useState([])
  const [selectedPn, setSelectedPn] = useState({} as Person)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const refDropdown = useRef(null)

  const { mutate } = useMutation({
    mutationFn: (payload: { id: string }) =>
      axios.delete(`${baseUrl}/${API_URL.DELETE_PN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: payload.id,
        },
      }),
  })

  const { mutate: linkFamily } = useMutation({
    mutationFn: (payload: {
      parent_account_reporter_id: string
      child_account_reporter_id: string
      parent_family_role: string
      child_family_role: string
    }) =>
      axios.post(
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
    console.log('masuk')
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
      }
    )
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span>Nama</span>,
        cell: (info) => {
          return (
            <div className="font-semibold capitalize">
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
        enableSorting: false,
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
        enableSorting: false,
      }),
      columnHelper.accessor('total_transaction', {
        header: () => <span>Jumlah Transaksi</span>,
        cell: (info) => {
          return (
            <div className="text-sm text-right">
              {thousandSeparator(info.getValue())}
            </div>
          )
        },
      }),
      columnHelper.accessor(
        (row) =>
          row.total_asset?.map((obj) => {
            const key = Object.keys(obj)[0]
            const item = obj[key]
            return (
              <div className="text-sm" key={key}>
                {`${key} ${numberAbbv(item)}`}
              </div>
            )
          }),
        {
          id: 'total_asset',
          header: () => <span>Total Asset</span>,
          cell: (info) => {
            return info.getValue()
          },
          enableSorting: false,
        }
      ),
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
            <div className="text-xs text-left">{info.getValue() || '-'}</div>
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
                  {/* NOTE: nanti diganti ke NIK, sementara by name dulu */}
                  <Link
                    href={`/penyelenggara-negara/${info.row.original.name}/summary`}
                  >
                    <button className="w-full p-2 flex gap-2 text-left hover:bg-gray-100">
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
    setSelectedPn({} as Person)
    setActionMenu('')
  })

  const table = useReactTable({
    data: pnList as Array<Person & { action: string }>,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting as any,
  })

  const handleSearch = (query: string) => {
    // Implement your filtering logic based on the query and field here
    console.log(`Searching for "${query}"`)
    // Example: Apply search logic to filter your table data and update state
  }

  const searchValue = useDebounce(search, 500)

  const searchNIK = async (value: string) => {
    setSearch(value)
    // NOTE: sementara masih by name dulu, nanti di atur search by yg lain
    const response = await fetch(
      `${baseUrl}/${API_URL.PN_LIST}?search=${value}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await response.json()
    const pn = data.data || {}
    const pnList = pn.account_reporter_list || []

    return pnList.map((item: Person) => ({
      value: item.id,
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
        <h2 className="font-semibold mb-4 text-lg">Arsipkan PN</h2>
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
              setSelectedPn({} as Person)
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
                    setSelectedPn({} as Person)
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
        onClose={() => setIsOpenFamilyForm(false)}
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
                    placeholder="Masukkan NIK anggota keluarga..."
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
                  label="Hubungan PN terhadap Keluarga"
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
                  label="Hubungan Keluarga terhadap PN"
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

          <button
            type="submit"
            className="mt-8 text-sm bg-black w-full text-white px-4 py-2 rounded-md hover:opacity-95"
          >
            Hubungkan Keluarga
          </button>
        </form>
      </Modal>

      <div className="mb-4 flex justify-between">
        <InputSearch
          onSearch={handleSearch}
          placeholder="Masukkan NIK atau Nama PN ..."
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
                    }`}
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
    </>
  )
}

export default PNTable
