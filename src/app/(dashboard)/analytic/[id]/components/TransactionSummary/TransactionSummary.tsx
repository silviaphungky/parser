'use client'

import { Card } from '@/components'

import InputDropdown from '@/components/InputDropdown'

import { useState } from 'react'

import TransactionHeatmapDate from '../TransactionHeatmapDate/TransactionHeatmapDate'

import {
  SumaryGlobalFilter,
  AssetChart,
  Top5Ranking,
  TreemapSubjectFreqValue,
  FrequencyPieChart,
} from './components'
import dayjs from 'dayjs'

export const transactionData = {
  balance: {
    total: 899999222,
    avg: 123123,
  },
  in: {
    total: 2330000,
    change: 10000,
    count: 333,
  },
  out: {
    total: 770000,
    change: 99000,
    count: 20,
  },
}

const topTransactionValueData = {
  in: [
    {
      name: 'Michelle',
      nominal: 1899999,
    },
    {
      name: 'Jarwo',
      nominal: 200000,
    },
    {
      name: 'David',
      nominal: 100000,
    },
    {
      name: 'Ilham',
      nominal: 88000,
    },
  ],

  out: [
    {
      name: 'Jodi',
      nominal: 388888,
    },
    {
      name: 'Joko',
      nominal: 80000,
    },
    {
      name: 'Dena',
      nominal: 12000,
    },
    {
      name: 'Dodi',
      nominal: 10000,
    },
  ],
}

const dataTreemap = {
  in: [
    { name: 'Ana', value: 2000000, frequency: 5 },
    { name: 'Maman', value: 1500000, frequency: 3 },
    { name: 'Gunawan', value: 1800000, frequency: 4 },
    { name: 'Amin', value: 1300000, frequency: 10 },
    { name: 'Ali', value: 70000, frequency: 3 },
    { name: 'Muna', value: 500000, frequency: 9 },
    { name: 'Gihi', value: 800000, frequency: 2 },
    { name: 'Rafli', value: 300000, frequency: 3 },
  ],
  out: [
    { name: 'Ana', value: 200000, frequency: 10 },
    { name: 'Bibi', value: 990000, frequency: 3 },
    { name: 'Ona', value: 100000, frequency: 3 },
    { name: 'Nami', value: 450000, frequency: 1 },
    { name: 'Ila', value: 70000, frequency: 3 },
    { name: 'Arga', value: 500000, frequency: 5 },
    { name: 'Teri', value: 19000, frequency: 1 },
    { name: 'Daniel', value: 77000, frequency: 7 },
  ],
}

const dataFreqPiechart = {
  category: {
    in: [
      { name: 'Investasi', value: 100000 },
      { name: 'Gaji', value: 2000000 },
      { name: 'Dividen', value: 3800000 },
    ],
    out: [
      { name: 'Investasi', value: 711100 },
      { name: 'Belanja', value: 3000000 },
      { name: 'Cicilan', value: 2880000 },
    ],
  },
  transactionMethod: {
    in: [
      { name: 'Qris', value: 199920 },
      { name: 'Mbanking', value: 1111300 },
      { name: 'Virtual Account', value: 88300 },
    ],
    out: [
      { name: 'Qris', value: 7792100 },
      { name: 'Mbanking', value: 1231300 },
      { name: 'Virtual Account', value: 66600 },
    ],
  },
}

const mockGroupByDate = [
  {
    '2024-05-01': {
      level: 1,
    },
  },
  {
    '2024-07-08': {
      level: 3,
    },
  },
  {
    '2024-07-09': {
      level: 1, // `data` attribute could be omitted
    },
  },
]

const mockSubjectFilter = [
  {
    id: 'in',
    label: 'Transaction In',
  },
  {
    id: 'out',
    label: 'Transaction Out',
  },
]

const TransactionSummary = () => {
  const [selectedBank, setSelectedBank] = useState<{
    id: string | number
    label: string
  }>({
    id: '',
    label: 'All banks',
  })

  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const handleChangeBank = (option: { id: string | number; label: string }) => {
    setSelectedBank(option)
  }

  const handleChangeDate = (range: {
    from: Date | undefined
    to: Date | undefined
  }) => {
    setSelectedDate(range)
  }

  return (
    <div className="mt-0">
      <SumaryGlobalFilter
        selectedBank={selectedBank}
        initialRange={{
          from: dayjs(new Date()).subtract(1, 'months').toDate(),
          to: new Date(),
        }}
        handleChangeBank={handleChangeBank}
        handleChangeDate={handleChangeDate}
      />

      <div className="flex gap-4">
        <AssetChart />
        <Top5Ranking data={topTransactionValueData} />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Transaction by Frequency</h2>
        <TreemapSubjectFreqValue data={dataTreemap} />
        <FrequencyPieChart data={dataFreqPiechart} />

        <div>
          <Card>
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm">Group by Date</div>
              <div className="w-[10rem]">
                <InputDropdown
                  options={mockSubjectFilter}
                  value={mockSubjectFilter[0]}
                  onChange={() => {}}
                />
              </div>
            </div>

            <TransactionHeatmapDate
              data={mockGroupByDate as any}
              color={[
                'rgba(255, 204, 204, 0.8)',
                'rgba(255, 153, 153, 0.8)',
                'rgba(255, 102, 102, 0.8)',
                'rgba(255, 77, 77, 0.8)',
                'rgba(255, 51, 51, 0.8)',
                'rgba(204, 41, 41, 0.8)',
                'rgba(153, 31, 31, 0.8)',
                'rgba(122, 35, 35, 0.8)',
                'rgba(115, 36, 36, 0.8)',
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
export default TransactionSummary