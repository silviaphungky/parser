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

const mockData: {
  all: Array<{
    [key: string]: {
      frequency: number
      value: number
    }
  }>
  in: Array<{
    [key: string]: {
      frequency: number
      value: number
    }
  }>
  out: Array<{
    [key: string]: {
      frequency: number
      value: number
    }
  }>
} = {
  all: [
    {
      '2024-04-02': {
        frequency: 10,
        value: 7000000,
      },
    },
    {
      '2024-04-03': {
        frequency: 8,
        value: 5000000,
      },
    },
    {
      '2024-05-07': {
        frequency: 3,
        value: 8800000,
      },
    },
    {
      '2024-07-06': {
        frequency: 10,
        value: 88000000,
      },
    },
    {
      '2024-07-01': {
        frequency: 4,
        value: 5000000,
      },
    },
    {
      '2024-01-01': {
        frequency: 3,
        value: 1000000,
      },
    },
  ],
  in: [
    {
      '2024-04-02': {
        frequency: 5,
        value: 5000000,
      },
    },
    {
      '2024-05-03': {
        frequency: 2,
        value: 7000000,
      },
    },
    {
      '2024-05-07': {
        frequency: 1,
        value: 800000,
      },
    },
    {
      '2024-07-06': {
        frequency: 10,
        value: 88000000,
      },
    },
    {
      '2024-07-01': {
        frequency: 4,
        value: 5000000,
      },
    },
    {
      '2024-01-01': {
        frequency: 3,
        value: 1000000,
      },
    },
  ],
  out: [
    {
      '2024-05-01': {
        frequency: 1,
        value: 800000,
      },
    },
    {
      '2024-07-08': {
        frequency: 6,
        value: 1000000,
      },
    },
    {
      '2024-07-09': {
        frequency: 2,
        value: 123000,
      },
    },
  ],
}

const mockGroupByDate = {
  all: mockData.all.map((item) => {
    const key = Object.keys(item)[0]
    let levelFreq = 0
    let levelVal = 0

    if (item[key].frequency > 10) levelFreq = 4
    else if (item[key].frequency > 7 && item[key].frequency <= 10) levelFreq = 3
    else if (item[key].frequency > 4 && item[key].frequency <= 7) levelFreq = 2
    else if (item[key].frequency > 0 && item[key].frequency <= 4) levelFreq = 1
    else levelFreq = 0

    if (item[key].value > 20000000) levelVal = 4
    else if (item[key].value > 10000000 && item[key].value <= 20000000)
      levelVal = 3
    else if (item[key].value > 2000000 && item[key].value <= 10000000)
      levelVal = 2
    else if (item[key].value > 0 && item[key].value <= 2000000) levelVal = 1
    else levelVal = 0

    return {
      [key]: { ...item[key], levelFreq, levelVal },
    }
  }),
  in: mockData.in.map((item) => {
    const key = Object.keys(item)[0]
    let levelFreq = 0
    let levelVal = 0

    if (item[key].frequency > 10) levelFreq = 4
    else if (item[key].frequency > 7 && item[key].frequency <= 10) levelFreq = 3
    else if (item[key].frequency > 4 && item[key].frequency <= 7) levelFreq = 2
    else if (item[key].frequency > 0 && item[key].frequency <= 4) levelFreq = 1
    else levelFreq = 0

    if (item[key].value > 20000000) levelVal = 4
    else if (item[key].value > 10000000 && item[key].value <= 20000000)
      levelVal = 3
    else if (item[key].value > 2000000 && item[key].value <= 10000000)
      levelVal = 2
    else if (item[key].value > 0 && item[key].value <= 2000000) levelVal = 1
    else levelVal = 0

    return {
      [key]: { ...item[key], levelFreq, levelVal },
    }
  }),
  out: mockData.out.map((item) => {
    const key = Object.keys(item)[0]
    let levelFreq = 0
    let levelVal = 0

    if (item[key].frequency > 10) levelFreq = 4
    else if (item[key].frequency > 7 && item[key].frequency <= 10) levelFreq = 3
    else if (item[key].frequency > 4 && item[key].frequency <= 7) levelFreq = 2
    else if (item[key].frequency > 0 && item[key].frequency <= 4) levelFreq = 1
    else levelFreq = 0

    if (item[key].value > 20000000) levelVal = 4
    else if (item[key].value > 10000000 && item[key].value <= 20000000)
      levelVal = 3
    else if (item[key].value > 2000000 && item[key].value <= 10000000)
      levelVal = 2
    else if (item[key].value > 0 && item[key].value <= 2000000) levelVal = 1
    else levelVal = 0

    return {
      [key]: { ...item[key], levelFreq, levelVal },
    }
  }),
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
      <div className="mb-12">
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
        <FreqValueHeatmapDate data={mockGroupByDate} />
      </div>
    </div>
  )
}
export default TransactionSummary
