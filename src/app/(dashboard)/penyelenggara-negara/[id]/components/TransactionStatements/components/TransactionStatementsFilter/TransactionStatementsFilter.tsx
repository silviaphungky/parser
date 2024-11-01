'use client'
import { useState } from 'react'
import { FormItem, Input, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import DatePickerRange from '@/components/DatePickerRange'
import ReactSelect from 'react-select'

interface FilterValues {
  startDate: string
  endDate: string
  selectedBank: string
  currency: string // Added currency field
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filterValues: FilterValues) => void
  bankOptions: { value: string | number; label: string }[]
  currencyOptions: { id: string | number; label: string }[]
}

const TransactionStatementsFilter: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  bankOptions,
  currencyOptions,
}) => {
  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
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
      <h2 className="text-lg font-bold mb-4">Filter Laporan Bank</h2>

      {/* Date Range Filter */}

      <div>
        <FormItem label="Periode">
          <DatePickerRange
            onRangeChange={handleChangeDate}
            className="w-full"
          />
        </FormItem>
      </div>
      <div>
        <FormItem label="Akun Bank">
          <ReactSelect
            isMulti
            name="banks"
            options={bankOptions}
            className="react-select-container"
            placeholder="Pilih akun bank..."
          />
        </FormItem>
      </div>
      <div className="mb-4 flex gap-4">
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

      <div className="flex justify-end mt-8 gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:opacity-80"
          onClick={onClose}
        >
          Batal
        </button>
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

export default TransactionStatementsFilter
