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
import { MultiValue } from 'react-select'

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
      bank: 'BCA',
      bankAccNo: '123412414',
    },
    {
      name: 'Jarwo',
      nominal: 200000,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
    {
      name: 'David',
      nominal: 100000,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
    {
      name: 'Ilham',
      nominal: 88000,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
  ],

  out: [
    {
      name: 'Jodi',
      nominal: 388888,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
    {
      name: 'Joko',
      nominal: 80000,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
    {
      name: 'Dena',
      nominal: 12000,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
    {
      name: 'Dodi',
      nominal: 10000,
      bank: 'BCA',
      bankAccNo: '123412414',
    },
  ],
}

const dataTreemap = {
  IN: [
    {
      name: 'Ana',
      bank: 'BCA',
      bankAccNo: '3212312313',
      value: 2000000,
      frequency: 5,
    },
    {
      name: 'Maman',
      bank: 'BNI',
      bankAccNo: 'N/A',
      value: 1500000,
      frequency: 3,
    },
    {
      name: 'Gunawan',
      bank: 'unknown',
      bankAccNo: '999999',
      value: 1800000,
      frequency: 4,
    },
    {
      name: 'unnamed',
      bank: 'BNI',
      bankAccNo: '91723912873',
      value: 1300000,
      frequency: 10,
    },
    {
      name: 'Ali',
      bank: 'BCA',
      bankAccNo: '3124124',
      value: 70000,
      frequency: 3,
    },
    {
      name: 'Muna',
      bank: 'BNI',
      bankAccNo: '314974893',
      value: 500000,
      frequency: 9,
    },
    {
      name: 'Gihi',
      bank: 'Mandiri',
      bankAccNo: '284428282',
      value: 800000,
      frequency: 2,
    },
    {
      name: 'Rafli',
      bank: 'BCA',
      bankAccNo: '77889789',
      value: 300000,
      frequency: 3,
    },
  ],
  OUT: [
    {
      name: 'Ana',
      bank: 'BCA',
      bankAccNo: '3212312313',
      value: 200000,
      frequency: 10,
    },
    {
      name: 'Bibi',
      bank: 'Mandiri',
      bankAccNo: '284428282',
      value: 990000,
      frequency: 3,
    },
    {
      name: 'Ona',
      bank: 'BNI',
      bankAccNo: '314974893',
      value: 100000,
      frequency: 3,
    },
    {
      name: 'Nami',
      bank: 'Mandiri',
      bankAccNo: '999999',
      value: 450000,
      frequency: 1,
    },
    {
      name: 'Ila',
      value: 70000,
      bank: 'BCA',
      bankAccNo: '3212312313',
      frequency: 3,
    },
    {
      name: 'Arga',
      bank: 'BNI',
      bankAccNo: '1123131',
      value: 500000,
      frequency: 5,
    },
    {
      name: 'Teri',
      bank: 'BCA',
      bankAccNo: '3212312313',
      value: 19000,
      frequency: 1,
    },
    {
      name: 'Daniel',
      bank: 'BNI',
      bankAccNo: '88862136',
      value: 77000,
      frequency: 7,
    },
  ],
}

const mockData: {
  all: Array<{
    [key: string]: {
      frequency: number
      value: number
    }
  }>
  IN: Array<{
    [key: string]: {
      frequency: number
      value: number
    }
  }>
  OUT: Array<{
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
  IN: [
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
  OUT: [
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
  IN: mockData.IN.map((item) => {
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
  OUT: mockData.OUT.map((item) => {
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

export const currencyOptions = [
  {
    id: 'IDR',
    label: 'IDR',
  },

  {
    id: 'GBP',
    label: 'GBP',
  },
  {
    id: 'JPY',
    label: 'JPY',
  },
  {
    id: 'SGD',
    label: 'SGD',
  },
  {
    id: 'USD',
    label: 'USD',
  },
]

const TransactionSummary = ({ token }: { token: string }) => {
  const [selectedBank, setSelectedBank] = useState<
    MultiValue<{ value: string; label: string }>
  >([])
  const [selectedCurrency, setSelectedCurrency] = useState<{
    id: string | number
    label: string
  }>(
    currencyOptions[0] as {
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

  const handleChangeBank = (
    selected: MultiValue<{ value: string; label: string }>
  ) => {
    setSelectedBank(selected)
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
          token={token}
          selectedDate={selectedDate}
          selectedBank={selectedBank}
          selectedCurrency={selectedCurrency}
          handleChangeBank={handleChangeBank}
          handleChangeDate={handleChangeDate}
          handleChangeCurrency={handleChangeCurrency}
        />
      </div>
      <div className="flex gap-4">
        <AssetChart
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          selectedBank={selectedBank}
          token={token}
        />
        <Top5Ranking
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          token={token}
          selectedBank={selectedBank}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Analisis Transaksi</h2>
        <TreemapSubjectFreqValue
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          token={token}
          data={dataTreemap}
          selectedBank={selectedBank}
        />
        <FrequencyPieChart
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          token={token}
          selectedBank={selectedBank}
        />
        <FreqValueHeatmapDate
          selectedCurrency={selectedCurrency}
          token={token}
          selectedBank={selectedBank}
        />
      </div>
    </div>
  )
}
export default TransactionSummary