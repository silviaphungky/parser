'use client'

import { Breadcrumbs, Card } from '@/components'
import UploadBankStatement from '../UploadBankStatement/UploadBankStatement'
import { useState } from 'react'
import { IconPlus } from '@/icons'
import { thousandSeparator } from '@/utils/thousanSeparator'
import Tab from '@/components/Tab'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

const WLInfo = ({
  data,
}: {
  data: {
    name: string
    totalAsset: number
    nik: string
    family: Array<{
      name: string
      relation: string
      relationNote?: string
      id: string
      NIK: string
    }>
  }
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpenUploadForm, setIsOpenUploadForm] = useState(false)

  return (
    <div>
      <UploadBankStatement
        isOpen={isOpenUploadForm}
        setIsOpen={setIsOpenUploadForm}
      />
      <div>
        <Breadcrumbs
          routes={[
            {
              label: 'Analytic',
              link: '/penyelenggara-negara',
            },
            {
              label: '1',
            },
          ]}
        />
      </div>
      <div className="mt-6">
        <Card>
          <div className="flex justify-between">
            <div>
              <div className="font-bold text-2xl">{data.name}</div>
              <div className="text-dark text-sm">{`NIK: ${data.nik}`}</div>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-semibold text-sm">{`Total Asset: Rp ${thousandSeparator(
                  data.totalAsset
                )}`}</div>
                <div className="text-xs text-dark">{`Latest bank statement: July 2024`}</div>
              </div>
              <button
                className="h-fit flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95"
                onClick={() => setIsOpenUploadForm(true)}
              >
                <IconPlus color="#fff" size={18} />
                Unggah Laporan Bank
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="mt-4">
          <Tab
            tabs={[
              {
                id: 'tab1',
                label: 'Ringkasan Transaksi',
                content: <></>,
                active: pathname === '/penyelenggara-negara/1/summary',
                handleClick: () => {
                  router.push('/penyelenggara-negara/1/summary')
                },
              },
              {
                id: 'tab2',
                label: 'Daftar Transaksi',
                content: <></>,
                active: pathname === '/penyelenggara-negara/1/transaction-list',
                handleClick: () => {
                  router.push('/penyelenggara-negara/1/transaction-list')
                },
              },
              {
                id: 'tab3',
                label: 'Daftar Laporan Bank',
                content: <></>,
                active:
                  pathname === '/penyelenggara-negara/1/transaction-statements',
                handleClick: () => {
                  router.push('/penyelenggara-negara/1/transaction-statements')
                },
              },
              {
                id: 'tab4',
                label: 'Daftar Relasi Keluarga',
                content: <></>,
                active: pathname === '/penyelenggara-negara/1/family',
                handleClick: () => {
                  router.push('/penyelenggara-negara/1/family')
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default WLInfo
