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
import { IconExpand, IconTrash } from '@/icons'
import Link from 'next/link'
import { FormItem, Input, Modal } from '@/components'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputDropdown from '@/components/InputDropdown'
import ReactSelect from 'react-select'

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
    name: 'Test 1',
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
    name: 'Test 2',
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
    name: 'Test 3',
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

// Dummy options for Family Name (replace with actual data if available)
const familyOptions = [
  { value: 'john_doe', label: 'John Doe' },
  { value: 'jane_doe', label: 'Jane Doe' },
  { value: 'susan_lee', label: 'Susan Lee' },
  { value: 'mike_smith', label: 'Mike Smith' },
]

// Role options
const roleOptions = [
  { id: 'children', label: 'Children' },
  { id: 'wife/husband', label: 'Wife/Husband' },
  { id: 'parents', label: 'Parents' },
  { id: 'other', label: 'Other' },
]

// Validation schema
const validationSchema = yup.object().shape({
  familyName: yup.object({
    value: yup.string().required(),
    label: yup.string().required('Family name is required'),
  }),
  role: yup.object({
    id: yup.string().required(),
    label: yup.string().required('Role is required'),
  }),
  otherRole: yup.string().when('role.id', {
    is: (val: string) => val === 'other',
    then: () => yup.string().required('Please specify the role'),
    otherwise: () => yup.string(),
  }),
})

const columnHelper = createColumnHelper<Person & { action: string }>()

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
      columnHelper.accessor('index', {
        header: () => <span>No.</span>,
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('name', {
        header: () => <span>Name</span>,
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('nik', {
        header: () => <span>NIK</span>,
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('family', {
        header: () => <span>#Linked Family</span>,
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('bankTotal', {
        header: () => <span>#Bank</span>,
        cell: (info) => {
          return info.getValue()
        },
      }),
      columnHelper.accessor('bankStatementTotal', {
        header: () => <span>#Bank Statement</span>,
        cell: (info) => {
          return thousandSeparator(info.getValue())
        },
      }),
      columnHelper.accessor('transactionTotal', {
        header: () => <span>#Transaction</span>,
        cell: (info) => {
          return thousandSeparator(info.getValue())
        },
      }),
      columnHelper.accessor('assetTotal', {
        header: () => <span>#Total Asset</span>,
        cell: (info) => {
          return `Rp ${numberAbbv(info.getValue())}`
        },
      }),
      columnHelper.accessor('action', {
        header: () => <span>Action</span>,
        cell: (info) => {
          return (
            <div className="flex gap-3">
              <button
                className="text-sm border p-2 rounded-lg hover:border-gray-400"
                onClick={() => setIsOpenFamilyForm(true)}
              >
                Link Family
              </button>
              <Link href={`/analytic/${info.row.original.id}`}>
                <button className="border p-2 rounded-lg hover:border-gray-400">
                  <IconExpand size={20} />
                </button>
              </Link>

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

  return (
    <>
      <Modal
        width="max-w-[30rem]"
        isOpen={isOpenFamilyForm}
        onClose={() => setIsOpenFamilyForm(false)}
      >
        <h2 className="font-semibold mb-4 text-lg">Link Family</h2>
        <div className="mb-4 text-sm">{`Linked family: 0 people`}</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              control={control}
              name="familyName"
              render={({ field, fieldState }) => (
                <FormItem label="Name" errorMessage={fieldState.error?.message}>
                  <ReactSelect
                    options={familyOptions}
                    placeholder="Select family member..."
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
                <FormItem label="Role" errorMessage={fieldState.error?.message}>
                  <InputDropdown
                    {...field}
                    options={roleOptions}
                    placeholder="Select role..."
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
                    label="Other Role"
                    errorMessage={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      placeholder="Input role"
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
            className="mt-8 text-sm bg-primary w-full text-white px-4 py-2 rounded-md hover:opacity-95"
          >
            Link Family
          </button>
        </form>
      </Modal>
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
