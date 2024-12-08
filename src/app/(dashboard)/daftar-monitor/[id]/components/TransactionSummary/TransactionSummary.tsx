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
import { MultiValue } from 'react-select'

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

const TransactionSummary = ({ token, baseUrl }: { token: string; baseUrl }) => {
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
          baseUrl={baseUrl}
        />
        <Top5Ranking
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          token={token}
          selectedBank={selectedBank}
          baseUrl={baseUrl}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Analisis Transaksi</h2>
        <TreemapSubjectFreqValue
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          token={token}
          selectedBank={selectedBank}
          baseUrl={baseUrl}
        />
        <FrequencyPieChart
          selectedCurrency={selectedCurrency}
          selectedDate={selectedDate}
          token={token}
          selectedBank={selectedBank}
          baseUrl={baseUrl}
        />
        <FreqValueHeatmapDate
          selectedCurrency={selectedCurrency}
          token={token}
          selectedBank={selectedBank}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  )
}
export default TransactionSummary
