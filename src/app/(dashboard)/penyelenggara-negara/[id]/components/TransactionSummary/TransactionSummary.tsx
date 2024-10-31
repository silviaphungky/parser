'use client'

import { useState } from 'react'

import {
  SumaryGlobalFilter,
  AssetChart,
  Top5Ranking,
  TreemapSubjectFreqValue,
  FrequencyPieChart,
  FreqValueHeatmapDate,
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

const mockGroupByDate = {
  in: [
    {
      '2024-04-02': {
        level: 2,
      },
    },
    {
      '2024-05-03': {
        level: 2,
      },
    },
    {
      '2024-05-07': {
        level: 4,
      },
    },
    {
      '2024-07-06': {
        level: 3,
      },
    },
    {
      '2024-07-01': {
        level: 1, // `data` attribute could be omitted
      },
    },
    {
      '2024-01-01': {
        level: 4, // `data` attribute could be omitted
      },
    },
  ],
  out: [
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
  ],
}

const TransactionSummary = () => {
  const [selectedBank, setSelectedBank] = useState<{
    id: string | number
    label: string
  }>({
    id: '',
    label: 'All banks',
  })
  const [selectedCurrency, setSelectedCurrency] = useState<{
    id: string | number
    label: string
  }>(
    {} as {
      id: string | number
      label: string
    }
  )

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

  const handleChangeCurrency = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedCurrency(option)
  }

  const handleChangeDate = (range: {
    from: Date | undefined
    to: Date | undefined
  }) => {
    setSelectedDate(range)
  }

  return (
    <div className="mt-0">
      <div className="mb-8">
        <SumaryGlobalFilter
          selectedBank={selectedBank}
          initialRange={{
            from: dayjs(new Date()).subtract(1, 'months').toDate(),
            to: new Date(),
          }}
          selectedCurrency={selectedCurrency}
          handleChangeBank={handleChangeBank}
          handleChangeDate={handleChangeDate}
          handleChangeCurrency={handleChangeCurrency}
        />
      </div>
      <div className="flex gap-4">
        <AssetChart />
        <Top5Ranking data={topTransactionValueData} />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Analisis Transaksi</h2>
        <TreemapSubjectFreqValue data={dataTreemap} />
        <FrequencyPieChart data={dataFreqPiechart} />
        <FreqValueHeatmapDate data={mockGroupByDate as any} />
      </div>
    </div>
  )
}
export default TransactionSummary
