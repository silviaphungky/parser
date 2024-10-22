'use client'

import { Breadcrumbs, Card } from '@/components'
import UploadBankStatement from '../UploadBankStatement/UploadBankStatement'
import { useState } from 'react'
import { IconPlus } from '@/icons'
import { thousandSeparator } from '@/utils/thousanSeparator'
import Tab from '@/components/Tab'
import { usePathname, useRouter } from 'next/navigation'

const WLInfo = ({
  data,
}: {
  data: {
    name: string
    totalAsset: number
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
              link: '/analytic',
            },
            {
              label: '1',
            },
          ]}
        />
      </div>
      <div className="mt-6">
        <Card>
          <div className="flex justify-between items-center">
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
                className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95"
                onClick={() => setIsOpenUploadForm(true)}
              >
                <IconPlus color="#fff" size={18} />
                Add Bank Statement
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
                label: 'Transaction Summary',
                content: <></>,
                active: pathname === '/analytic/1/summary',
                handleClick: () => {
                  router.push('/analytic/1/summary')
                },
              },
              {
                id: 'tab2',
                label: 'Transaction List',
                content: <></>,
                active: pathname === '/analytic/1/transaction-list',
                handleClick: () => {
                  router.push('/analytic/1/transaction-list')
                },
              },
              {
                id: 'tab3',
                label: 'Transaction Bank Statements',
                content: <></>,
                active: pathname === '/analytic/1/bank-statement-list',
                handleClick: () => {
                  router.push('/analytic/1/bank-statement-list')
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
