import { ReactNode, useEffect, useRef, useState } from 'react'
import { IconKebab, IconTrash, IconUnlink } from '@/icons'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import Link from 'next/link'

type FamilyData = {
  id: string
  NIK: string
  name: string
  relation: 'Suami/Istri' | 'Orang tua' | 'Anak' | 'Lainnya'
  other_relation?: string
}

const familyRelations: Array<FamilyData & { actions: ReactNode }> = [
  {
    id: '2',
    NIK: '3201010101010002',
    name: 'Siti Aisyah',
    relation: 'Suami/Istri',
    actions: '',
  },
  {
    id: '3',
    NIK: '3201010101010003',
    name: 'Budi Pratama',
    relation: 'Anak',
    actions: '',
  },
  {
    id: '4',
    NIK: '3201010101010004',
    name: 'Dewi Kartika',
    relation: 'Anak',
    actions: '',
  },
  {
    id: '5',
    NIK: '3201010101010005',
    name: 'Toni Wibowo',
    relation: 'Orang tua',
    actions: '',
  },
  {
    id: '6',
    NIK: '3201010101010006',
    name: 'Sri Wahyuni',
    relation: 'Orang tua',
    actions: '',
  },
  {
    id: '7',
    NIK: '3201010101010007',
    name: 'Rahmat Saputra',
    relation: 'Lainnya',
    other_relation: 'Saudara Kandung',
    actions: '',
  },
  {
    id: '8',
    NIK: '3201010101010008',
    name: 'Lia Suryani',
    relation: 'Lainnya',
    other_relation: 'Bibi',
    actions: '',
  },
]

const columnHelper = createColumnHelper<FamilyData & { actions: any }>()

const FamilyTable = () => {
  const ref = useRef(null)
  const [selected, setSelected] = useState<FamilyData | null>(null)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const columns = [
    columnHelper.accessor('NIK', {
      header: 'NIK',
      cell: (info) => (
        <div className="text-sm font-semibold">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Nama',
      cell: (info) => (
        <div className="text-sm font-semibold">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('relation', {
      header: 'Hubungan',
      cell: (info) =>
        info.getValue() === 'Lainnya'
          ? `${info.getValue()} - ${info.row.original.other_relation}`
          : info.getValue(),
    }),
    columnHelper.accessor('actions', {
      header: '',
      cell: (info) => (
        <div className="flex gap-4">
          <Link href={`/penyelenggara-negara/${info.row.id}/summary`}>
            <button className="flex gap-2 items-center border p-2 rounded-lg hover:border-gray-400">
              <div className="text-xs text-black">Detail</div>
            </button>
          </Link>
          <button className="flex gap-2 items-center border p-2 rounded-lg hover:border-gray-400">
            <div className="text-xs">Hapus relasi</div>
            <IconUnlink size={14} color="#EA454C" />
          </button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: familyRelations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div className="p-2">
        <div
          className="overflow-x-auto"
          style={{
            width: 'calc(100vw - 21rem)',
          }}
        >
          {familyRelations.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg font-medium">
                Tidak ada data yang tersedia
              </p>
              <p className="text-sm">
                Relasi keluarga akan ditampilkan di sini. Silahkan hubungkan
                relasi keluarga
              </p>
            </div>
          )}
          {familyRelations.length > 0 && (
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
          )}
        </div>
      </div>
    </>
  )
}

export default FamilyTable
