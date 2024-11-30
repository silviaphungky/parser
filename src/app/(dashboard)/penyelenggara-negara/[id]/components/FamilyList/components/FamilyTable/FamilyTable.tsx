import { IconUnlink } from '@/icons'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import { useParams } from 'next/navigation'
import { Shimmer } from '@/components'
import { baseUrl } from '../../../UploadBankStatement/UploadBankStatement'
import toast from 'react-hot-toast'
import Button from '@/components/Button'

const columnHelper = createColumnHelper<
  {
    account_reporter_id: string
    child_role: string
    name: string
    nik: string
    parent_role: string
    is_monitored: boolean
  } & { actions: any }
>()

const FamilyTable = ({ token }: { token: string }) => {
  const { id } = useParams()

  const { mutate: unlinkFamily } = useMutation({
    mutationFn: (payload: {
      parent_account_reporter_id: string
      child_account_reporter_id: string
    }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.UNLINK_FAMILY}`,
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

  const { mutate: createPn, isPending } = useMutation({
    mutationFn: (payload: { nik: string; name: string }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.CREATE_PN}`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: () => {
      refetch()
      toast.success('PN berhasil ditambahkan sebagai daftar monitor')
    },
    onError: (error: any) => {
      toast.error(
        `Gagal menambahkan PN sebagai daftar monitor: ${error?.response?.data?.message}`
      )
    },
  })

  const {
    data = { account_reporter_family_list: [] },
    isLoading,
    refetch,
  } = useQuery<{
    account_reporter_family_list: Array<{
      account_reporter_id: string
      child_role: string
      name: string
      nik: string
      parent_role: string
      is_monitored: boolean
    }>
  }>({
    queryKey: ['familyList', id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.FAMILY_LIST}/${id}/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns = [
    columnHelper.accessor('nik', {
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
    columnHelper.accessor('child_role', {
      header: 'Hubungan terhadap PN',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('actions', {
      header: '',
      cell: (info) => (
        <div className="flex gap-4 items-center">
          {info.row.original.is_monitored && (
            <Link
              href={`/penyelenggara-negara/${info.row.original.account_reporter_id}/summary`}
            >
              <Button variant="white-outline">Lihat Detail</Button>
            </Link>
          )}
          {!info.row.original.is_monitored && (
            <Button
              loading={isPending}
              variant="dark"
              onClick={() => {
                createPn({
                  name: info.row.original.name,
                  nik: info.row.original.nik,
                })
              }}
            >
              Tambahkan Daftar Monitor
            </Button>
          )}
          <Button
            variant="white-outline"
            onClick={() => {
              unlinkFamily(
                {
                  parent_account_reporter_id: id as string,
                  child_account_reporter_id:
                    info.row.original.account_reporter_id,
                },
                {
                  onSuccess: () => {
                    toast.success('Berhasil menghapus hubungan keluarga')
                    refetch()
                  },
                  onError: (error: any) => {
                    toast.success(
                      `Gagal menghapus hubungan keluarga: ${error?.response?.data?.message}`
                    )
                  },
                }
              )
            }}
          >
            <div className="flex gap-2 items-center">
              Hapus relasi
              <IconUnlink size={16} color="#EA454C" />
            </div>
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: (data?.account_reporter_family_list || []) as Array<
      {
        account_reporter_id: string
        child_role: string
        name: string
        nik: string
        parent_role: string
        is_monitored: boolean
      } & { actions: any }
    >,
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
          {!isLoading && data.account_reporter_family_list.length === 0 && (
            <>
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">
                  Tidak ada data yang tersedia
                </p>
                <p className="text-sm">
                  Relasi keluarga akan ditampilkan di sini. Silahkan hubungkan
                  relasi keluarga
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default FamilyTable
