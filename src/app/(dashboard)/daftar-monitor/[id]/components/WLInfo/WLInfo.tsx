'use client'

import { Breadcrumbs, Card, Shimmer } from '@/components'
import UploadBankStatement from '../UploadBankStatement/UploadBankStatement'
import { ReactNode, useState } from 'react'
import { IconPlus } from '@/icons'
import Tab from '@/components/Tab'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import dayjs from 'dayjs'

const WLInfo = ({
  token,
  children,
}: {
  token: string
  children: ReactNode
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { id } = useParams()

  const [isOpenUploadForm, setIsOpenUploadForm] = useState(false)
  const { data, isLoading } = useQuery<{
    created_at: string
    id: string
    name: string
    newest_statement_period: string
    nik: string
    oldest_statement_period: string
    updated_at: string
  }>({
    queryKey: ['wlInfo', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URL.PN}/${id}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return (
    <div>
      <UploadBankStatement
        token={token}
        isOpen={isOpenUploadForm}
        setIsOpen={setIsOpenUploadForm}
        nik={data?.nik || ''}
      />
      <div>
        <Breadcrumbs
          routes={[
            {
              label: 'Daftar Monitor',
              link: '/daftar-monitor',
            },
            {
              label: data?.name || (id as string),
            },
          ]}
        />
      </div>
      <div className="mt-6">
        <Card>
          {isLoading && <Shimmer />}
          {!isLoading && (
            <div className="flex justify-between">
              <div>
                <div className="font-bold text-2xl">{data?.name}</div>
                <div className="text-dark text-sm">{`NIK: ${data?.nik}`}</div>
              </div>
              <div className="flex gap-8">
                <div>
                  <button
                    className="h-fit flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95"
                    onClick={() => setIsOpenUploadForm(true)}
                  >
                    <IconPlus color="#fff" size={18} />
                    Unggah Laporan Bank
                  </button>
                  <div className="mt-2">
                    <div className="text-xs text-dark">
                      Tanggal transaksi terbaru:{' '}
                      <strong>
                        {data?.newest_statement_period
                          ? dayjs(
                              new Date(data.newest_statement_period)
                            ).format('DD MMMM YYYY')
                          : '-'}
                      </strong>
                    </div>
                    <div className="text-xs text-dark">
                      Tanggal transaksi terlama:{' '}
                      <strong>
                        {' '}
                        {data?.oldest_statement_period
                          ? dayjs(
                              new Date(data.oldest_statement_period)
                            ).format('DD MMMM YYYY')
                          : '-'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {!isLoading && (
        <div>
          <div className="mt-4">
            <Tab
              tabs={[
                {
                  id: 'tab1',
                  label: 'Ringkasan Transaksi',
                  content: <></>,
                  active: pathname === `/daftar-monitor/${id}/summary`,
                  handleClick: () => {
                    router.push(`/daftar-monitor/${id}/summary`)
                  },
                },
                {
                  id: 'tab2',
                  label: 'Daftar Transaksi',
                  content: <></>,
                  active: pathname === `/daftar-monitor/${id}/transaction-list`,
                  handleClick: () => {
                    router.push(`/daftar-monitor/${id}/transaction-list`)
                  },
                },
                {
                  id: 'tab3',
                  label: 'Daftar Laporan Bank',
                  content: <></>,
                  active:
                    pathname === `/daftar-monitor/${id}/transaction-statements`,
                  handleClick: () => {
                    router.push(`/daftar-monitor/${id}/transaction-statements`)
                  },
                },
                {
                  id: 'tab4',
                  label: 'Daftar Relasi Keluarga',
                  content: <></>,
                  active: pathname === `/daftar-monitor/${id}/family`,
                  handleClick: () => {
                    router.push(`/daftar-monitor/${id}/family`)
                  },
                },
              ]}
            />
          </div>
        </div>
      )}

      {!isLoading && children}
    </div>
  )
}

export default WLInfo
