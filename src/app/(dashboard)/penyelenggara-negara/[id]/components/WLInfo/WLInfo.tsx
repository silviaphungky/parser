'use client'

import { Breadcrumbs, Card, Shimmer } from '@/components'
import UploadBankStatement from '../UploadBankStatement/UploadBankStatement'
import { ReactNode, useState } from 'react'
import { IconPlus } from '@/icons'
import Tab from '@/components/Tab'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getPNList } from '@/app/service/getPNList'
import { API_URL } from '@/constants/apiUrl'

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
  const { data, isLoading } = useQuery({
    queryKey: ['wlInfo', id],
    queryFn: async () =>
      await getPNList(`${API_URL.PN_LIST}?search=${id}&limit=1`, token),
  })

  const pn = data?.account_reporter_list?.[0] || {}

  return (
    <div>
      <UploadBankStatement
        token={token}
        isOpen={isOpenUploadForm}
        setIsOpen={setIsOpenUploadForm}
        name={pn.name}
        nik={pn.nik}
      />
      <div>
        <Breadcrumbs
          routes={[
            {
              label: 'Penyelenggara Negara',
              link: '/penyelenggara-negara',
            },
            {
              label: id as string,
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
                <div className="font-bold text-2xl">{pn.name}</div>
                <div className="text-dark text-sm">{`NIK: ${pn.nik}`}</div>
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
                      Pembaruan laporan bank terbaru:{' '}
                      <strong>November 2024</strong>
                    </div>
                    <div className="text-xs text-dark">
                      Pembaruan laporan bank terlama:{' '}
                      <strong>Januari 2024</strong>
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
                  active: pathname === `/penyelenggara-negara/${id}/summary`,
                  handleClick: () => {
                    router.push(`/penyelenggara-negara/${id}/summary`)
                  },
                },
                {
                  id: 'tab2',
                  label: 'Daftar Transaksi',
                  content: <></>,
                  active:
                    pathname === `/penyelenggara-negara/${id}/transaction-list`,
                  handleClick: () => {
                    router.push(`/penyelenggara-negara/${id}/transaction-list`)
                  },
                },
                {
                  id: 'tab3',
                  label: 'Daftar Laporan Bank',
                  content: <></>,
                  active:
                    pathname ===
                    `/penyelenggara-negara/${id}/transaction-statements`,
                  handleClick: () => {
                    router.push(
                      `/penyelenggara-negara/${id}/transaction-statements`
                    )
                  },
                },
                {
                  id: 'tab4',
                  label: 'Daftar Relasi Keluarga',
                  content: <></>,
                  active: pathname === `/penyelenggara-negara/${id}/family`,
                  handleClick: () => {
                    router.push(`/penyelenggara-negara/${id}/family`)
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
