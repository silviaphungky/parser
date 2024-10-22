'use client'

import { Breadcrumbs, Card } from '@/components'
import { IconPlus } from '@/icons'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { TransactionSummary } from './components'
import Tab from '@/components/Tab'
import UploadBankStatement from './components/UploadBankStatement/UploadBankStatement'
import { useState } from 'react'

const PNDATA = {
  name: 'Anton',
  nik: '12345678',
  totalAsset: 456789876,
}

const PNAnalyticPage = () => {
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
              <div className="font-bold text-2xl">{PNDATA.name}</div>
              <div className="text-dark text-sm">{`NIK: ${PNDATA.nik}`}</div>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-semibold text-sm">{`Total Asset: Rp ${thousandSeparator(
                  PNDATA.totalAsset
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
        <div className="mt-4">
          <Tab
            tabs={[
              {
                id: 'tab1',
                label: 'Transaction Summary',
                content: <TransactionSummary />,
              },
              {
                id: 'tab2',
                label: 'Transaction List',
                content: 'Content of Tab 2',
              },
              {
                id: 'tab3',
                label: 'Transaction Bank Statements',
                content: 'Content of Tab 3',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default PNAnalyticPage
