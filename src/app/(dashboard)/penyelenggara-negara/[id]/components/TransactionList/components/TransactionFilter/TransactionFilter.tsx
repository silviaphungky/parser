'use client'
import { useState } from 'react'
import { FormItem, Input, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import DatePickerRange from '@/components/DatePickerRange'
import ReactSelect from 'react-select'
import { mockCategoryOptions } from '../TransactionCategoryModal/TransactionCategoryModal'
import Button from '@/components/Button'

interface FilterValues {
  startDate: string
  endDate: string
  transactionType: string
  minMutation: number
  maxMutation: number
  selectedBank: string
  currency: string // Added currency field
}

const highlightOptions = [
  {
    id: '',
    label: 'Semua Transaksi',
  },
  {
    id: '0',
    label: 'Tanpa Tanda',
  },
  {
    id: '1',
    label: 'Dengan Tanda',
  },
]

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filterValues: FilterValues) => void
  bankOptions: { value: string | number; label: string }[]
  currencyOptions: { id: string | number; label: string }[]
  transactionTypeOptions: { id: string | number; label: string }[]
}

const TransactionFilter: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  bankOptions,
  currencyOptions,
  transactionTypeOptions,
}) => {
  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [highlight, setHighlight] = useState<{
    id: string | number
    label: string
  }>(highlightOptions[0])
  const [category, setCategory] = useState<{
    id: string | number
    label: string
  }>({ id: '', label: 'Semua Transaksi' })
  const [transactionType, setTransactionType] = useState<{
    id: string | number
    label: string
  }>(transactionTypeOptions[0])
  const [minMutation, setMinMutation] = useState(0)
  const [maxMutation, setMaxMutation] = useState(0)
  const [selectedBank, setSelectedBank] = useState<{
    value: string | number
    label: string
  }>(bankOptions[0])
  const [currency, setCurrency] = useState<{
    id: string | number
    label: string
  }>(currencyOptions[0])

  const handleApplyFilter = () => {
    const filterValues: FilterValues = {
      startDate: `${selectedDate.from}`,
      endDate: `${selectedDate.to}`,
      transactionType: transactionType.id as string,
      minMutation,
      maxMutation,
      selectedBank: selectedBank.value as string,
      currency: currency.id as string,
    }
    onApplyFilter(filterValues)
    onClose()
  }

  const handleChangeDate = (range: {
    from: Date | undefined
    to: Date | undefined
  }) => {
    setSelectedDate(range)
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Filter Transaksi</h2>

      {/* Date Range Filter */}

      <div className="flex gap-4">
        <div className="flex-1">
          <FormItem label="Periode">
            <DatePickerRange onRangeChange={handleChangeDate} />
          </FormItem>
        </div>
        <div className="flex-1">
          <FormItem label="Bank Personal">
            <ReactSelect
              isMulti
              name="banks"
              options={bankOptions}
              className="react-select-container"
            />
          </FormItem>
        </div>
      </div>

      {/* Mutation Range Filter */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <FormItem label="Min. Nominal Transaksi">
            <Input
              type="number"
              className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={minMutation}
              onChange={(e) => setMinMutation(Number(e.target.value))}
              placeholder="Masukkan nominal transaksi..."
            />
          </FormItem>
        </div>
        <div className="w-1/2">
          <FormItem label="Maks. Nominal Transaksi">
            <Input
              type="number"
              className="w-full px-3 py-2 text-sm mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={maxMutation}
              onChange={(e) => setMaxMutation(Number(e.target.value))}
              placeholder="Masukkan nominal transaksi..."
            />
          </FormItem>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormItem label="Db/Cr">
            <InputDropdown
              placeholder="Pilih Db/Cr..."
              options={transactionTypeOptions}
              value={transactionType}
              onChange={(option) => setTransactionType(option)}
            />
          </FormItem>
        </div>
        <div className="flex-1">
          <FormItem label="Mata Uang">
            <InputDropdown
              options={currencyOptions}
              value={currency}
              onChange={setCurrency}
            />
          </FormItem>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormItem label="Tanda Transaksi">
            <InputDropdown
              placeholder="Pilih tanda..."
              options={highlightOptions}
              value={highlight}
              onChange={(option) => setHighlight(option)}
            />
          </FormItem>
        </div>
        <div className="flex-1">
          <FormItem label="Kategori Transaksi">
            <InputDropdown
              placeholder="Pilih kategori transaksi..."
              options={[
                { id: '', label: 'Semua Transaksi' },
                ...mockCategoryOptions,
              ]}
              value={category}
              onChange={(option) => setCategory(option)}
            />
          </FormItem>
        </div>
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:opacity-80"
          onClick={onClose}
        >
          Batal
        </button>
        <Button variant="white-outline">Reset Filter</Button>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-80"
          onClick={handleApplyFilter}
        >
          Terapkan Filter
        </button>
      </div>
    </Modal>
  )
}

export default TransactionFilter
