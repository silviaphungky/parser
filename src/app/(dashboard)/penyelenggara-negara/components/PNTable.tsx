'use client'
import * as React from 'react'

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
  IconChevronDown,
  IconExpand,
  IconFilter,
  IconSort,
  IconTrash,
} from '@/icons'
import Link from 'next/link'
import { FormItem, Input, InputSearch, Modal } from '@/components'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputDropdown from '@/components/InputDropdown'
import ReactSelect from 'react-select'
import { colorToken } from '@/constants/color-token'

type Person = {
  id: number
  index: number
  name: string
  nik: string
  bankTotal: number
  bankStatementTotal: number
  transactionTotal: number
  assetTotal: number
  family: number
}

const defaultData: (Person & { action: string })[] = [
  {
    id: 1,
    index: 1,
    name: 'Anton Soni',
    nik: '123456789',
    bankTotal: 1,
    bankStatementTotal: 10,
    transactionTotal: 1893,
    assetTotal: 1929300,
    family: 0,
    action: '',
  },
  {
    id: 2,
    index: 2,
    name: 'Budi Soni',
    nik: '987654321',
    bankTotal: 3,
    bankStatementTotal: 25,
    transactionTotal: 888,
    assetTotal: 6095955555,
    family: 7,
    action: '',
  },
  {
    id: 3,
    index: 3,
    name: 'Celica Nana H.',
    nik: '88763931123',
    bankTotal: 0,
    bankStatementTotal: 0,
    transactionTotal: 0,
    assetTotal: 0,
    family: 1,
    action: '',
  },
]

interface LinkFamilyFormProps {
  isOpenFamilyForm: boolean
  setIsOpenFamilyForm: (isOpen: boolean) => void
}

interface FormValues {
  familyName: {
    value: string
    label: string
  }
  role: {
    id: string
    label: string
  }
  otherRole?: string
}

const familyOptions = [
  { value: '310000002', label: '310000002 - John Doe' },
  { value: '310000003', label: '310000003 - Jane Doe' },
  { value: '310000004', label: '310000004 - Susan Lee' },
  { value: '310000005', label: '310000005 - Mike Smith' },
]

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
    label: yup.string().required('Anggota keluarga wajib dipilih'),
  }),
  role: yup.object({
    id: yup.string().required(),
    label: yup.string().required('Hubungan wajib diisi'),
  }),
  otherRole: yup.string().when('role.id', {
    is: (val: string) => val === 'other',
    then: () => yup.string().required('Mohon masukkan detail hubungan'),
    otherwise: () => yup.string(),
  }),
})

const columnHelper = createColumnHelper<Person & { action: string }>()

const searchFields = [
  { label: 'Nama PN', id: 'pnName' },
  { label: 'NIK PN', id: 'pnNIK' },
]

const sortOptions = [
  { label: 'Nama - A-Z', id: 'name' },
  { label: 'Nama - Z-A', id: '-name' },
  { label: 'Jumlah Relasi Keluarga - Terbanyak', id: 'relation' },
  { label: 'Jumlah Relasi Keluarga - Tersedikit', id: '-relation' },
  { label: 'Jumlah Transaksi - Terbanyak', id: 'frequency' },
  { label: 'Jumlah Transaksi - Tersedikit', id: '-frequency' },
  { label: 'Akun Bank - Paling banyak', id: 'bankAccount' },
  { label: 'Akun Bank - Paling sedikit', id: '-bankAccount' },
  { label: 'Total Asset - Paling banyak', id: 'totalAsset' },
  { label: 'Total Asset - Paling sedikit', id: '-totalAsset' },
]

const PNTable = () => {
  const [isOpenFamilyForm, setIsOpenFamilyForm] = React.useState(false)
  const { handleSubmit, control, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      role: {
        id: '',
        label: '',
      },
    },
  })
  const [selectedSort, setSelectedSort] = React.useState<{
    id: string | number
    label: string
  }>({ id: '', label: '' })
  const selectedRole =
    useWatch({
      name: 'role',
      control,
    }) || {}

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // Handle form submission
    setIsOpenFamilyForm(false)
  }

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span>Nama</span>,
        cell: (info) => {
          return <div className="font-semibold">{info.getValue()}</div>
        },
      }),
      columnHelper.accessor('nik', {
        header: () => <span>NIK</span>,
        cell: (info) => {
          return <div className="font-semibold">{info.getValue()}</div>
        },
      }),
      columnHelper.accessor('family', {
        header: () => (
          <div>
            <div>Jumlah Relasi</div>
            <div>Keluarga</div>
          </div>
        ),
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('bankTotal', {
        header: () => (
          <div>
            <div>Jumlah Akun</div>
            <div>Bank</div>
          </div>
        ),
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('bankStatementTotal', {
        header: () => (
          <div>
            <div>Jumlah Laporan</div>
            <div>Bank</div>
          </div>
        ),
        cell: (info) => {
          return thousandSeparator(info.getValue())
        },
      }),
      columnHelper.accessor('transactionTotal', {
        header: () => <span>Jumlah Transaksi</span>,
        cell: (info) => {
          return thousandSeparator(info.getValue())
        },
      }),
      columnHelper.accessor('assetTotal', {
        header: () => <span>Total Asset</span>,
        cell: (info) => {
          return `Rp ${numberAbbv(info.getValue())}`
        },
      }),
      columnHelper.accessor('action', {
        header: () => <span>Aksi</span>,
        cell: (info) => {
          return (
            <div className="flex gap-3 items-center">
              <Link href={`/penyelenggara-negara/${info.row.original.id}`}>
                <button className="border items-center p-2 rounded-lg hover:border-gray-400 flex gap-2">
                  <div className="text-xs">Detail</div>
                  <IconExpand size={16} color={colorToken.grayVulkanik} />
                </button>
              </Link>
              <button
                className="text-xs border p-2 rounded-lg hover:border-gray-400"
                onClick={() => setIsOpenFamilyForm(true)}
              >
                Hubungkan Keluarga
              </button>
              <button className="border p-2 rounded-lg hover:border-gray-400">
                <IconTrash size={20} color="#EA454C" />
              </button>
            </div>
          )
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSearch = (query: string) => {
    // Implement your filtering logic based on the query and field here
    console.log(`Searching for "${query}"`)
    // Example: Apply search logic to filter your table data and update state
  }

  const handleSort = (option: { id: string | number; label: string }) => {
    setSelectedSort(option)
  }

  return (
    <>
      <Modal
        width="max-w-[30rem]"
        isOpen={isOpenFamilyForm}
        onClose={() => setIsOpenFamilyForm(false)}
      >
        <h2 className="font-semibold mb-4 text-lg">Hubungkan Keluarga</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              control={control}
              name="familyName"
              render={({ field, fieldState }) => (
                <FormItem label="Nama" errorMessage={fieldState.error?.message}>
                  <ReactSelect
                    options={familyOptions}
                    placeholder="Pilih anggota keluarga..."
                    {...field}
                    className="react-select-container"
                  />
                </FormItem>
              )}
            />
          </div>

          {/* Role Selection */}
          <div>
            <Controller
              control={control}
              name="role"
              render={({ field, fieldState }) => (
                <FormItem
                  label="Hubungan"
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

          {selectedRole.id === 'other' && (
            <div>
              <Controller
                control={control}
                name="otherRole"
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
          placeholder="Masukkan NIK atau Nama PN..."
        />
        <div className="w-max">
          <InputDropdown
            reset
            value={selectedSort}
            hideChevron
            options={sortOptions}
            placeholder={
              <div className="flex gap-2 items-center">
                <div>Urutkan berdasarkan</div>
                <IconSort />
              </div>
            }
            onChange={handleSort}
          />
        </div>
      </div>
      <div className="p-2">
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
    </>
  )
}

export default PNTable
