'use client'
import { useState } from 'react'
import { FormItem, Input, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import DatePickerRange from '@/components/DatePickerRange'
import ReactSelect, { MultiValue } from 'react-select'
import { mockCategoryOptions } from '../TransactionCategoryModal/TransactionCategoryModal'
import Button from '@/components/Button'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useParams } from 'next/navigation'
import { thousandSeparator } from '@/utils/thousanSeparator'

interface FilterValues {
  startDate?: Date
  endDate?: Date
  transactionType: string
  minMutation?: number
  maxMutation?: number
  selectedBank: MultiValue<{ value: string; label: string }>
  currency: string
  isHighlight: boolean | string
  transactionMethod: string
  category: string
}

const highlightOptions = [
  {
    id: '',
    label: 'Semua Transaksi',
  },
  {
    id: false,
    label: 'Tanpa Tanda',
  },
  {
    id: true as any,
    label: 'Dengan Tanda',
  },
]

export const transactionMethodOptions = [
  { id: 'TRANSFER BANK', label: 'Transfer Bank' },
  {
    id: 'PEMBAYARAN KARTU (DEBIT/KREDIT)',
    label: 'Pembayaran Kartu (Debit/Kredit)',
  },
  { id: 'DOMPET DIGITAL', label: 'Dompet Digital' },
  { id: 'PEMBAYARAN DENGAN KODE QR', label: 'Pembayaran dengan Kode QR' },
  {
    id: 'TRANSAKSI TUNAI (TERMASUK ATM)',
    label: 'Transaksi Tunai (termasuk ATM)',
  },
  {
    id: 'KREDIT BANK',
    label: 'Kredit Bank',
  },
  {
    id: 'DEBET BANK',
    label: 'Debit Bank',
  },
  { id: 'TIDAK DIKETAHUI (UNKNOWN)', label: 'Tidak Diketahui (Unknown)' },
]

interface FilterModalProps {
  token: string
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filterValues: FilterValues) => void
  currencyOptions: { id: string | number; label: string }[]
  transactionTypeOptions: { id: string | number; label: string }[]
  currency?: string
  bank: MultiValue<{ value: string; label: string }>
  date?: {
    from: Date | undefined
    to: Date | undefined
  }
  transactionType?: string
  minMutation?: number
  maxMutation?: number
  isHighlight: boolean | string
  category?: string
  transactionMethod?: string
}

const TransactionFilter: React.FC<FilterModalProps> = ({
  token,
  isOpen,
  onClose,
  onApplyFilter,
  currencyOptions,
  transactionTypeOptions,
  date: initialDate,
  transactionType: initialTransactionType,
  minMutation: initialMinMutation,
  maxMutation: initialMaxMutation,
  isHighlight: initialIsHighlight,
  bank: initialSelectedBank,
  currency: initialCurrency,
  category: initialCategory,
  transactionMethod: initialTransactionMethod,
}) => {
  const { id } = useParams()
  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: initialDate?.from,
    to: initialDate?.to,
  })
  const [highlight, setHighlight] = useState<{
    id: any
    label: string
  }>(
    highlightOptions.find((el) => el.id === initialIsHighlight) ||
      highlightOptions[0]
  )
  const [category, setCategory] = useState<{
    id: string | number
    label: string
  }>(
    mockCategoryOptions.find((el) => el.id === initialCategory) || {
      id: '',
      label: 'Semua Transaksi',
    }
  )
  const [transactionMethod, setTransactionMethod] = useState<{
    id: string | number
    label: string
  }>(
    transactionMethodOptions.find(
      (el) => el.id === initialTransactionMethod
    ) || {
      id: '',
      label: 'Semua Transaksi',
    }
  )
  const [transactionType, setTransactionType] = useState<{
    id: string | number
    label: string
  }>(
    transactionTypeOptions.find((el) => el.id === initialTransactionType) ||
      transactionTypeOptions[0]
  )
  const [minMutation, setMinMutation] = useState(initialMinMutation || 0)
  const [maxMutation, setMaxMutation] = useState(initialMaxMutation || 0)
  const [selectedBank, setSelectedBank] = useState<
    MultiValue<{ value: string; label: string }>
  >(initialSelectedBank.length ? initialSelectedBank : [])
  const [currency, setCurrency] = useState<{
    id: string | number
    label: string
  }>(
    currencyOptions.find((el) => el.id === initialCurrency) ||
      currencyOptions[0]
  )

  const handleApplyFilter = () => {
    const filterValues: FilterValues = {
      startDate: selectedDate.from,
      endDate: selectedDate.to,
      transactionType: transactionType.id as string,
      minMutation,
      maxMutation,
      isHighlight: highlight.id as boolean,
      selectedBank,
      currency: currency.id as string,
      transactionMethod: transactionMethod.id as string,
      category: category.id as string,
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

  const {
    data = { account_reporter_and_family_statement_list: [] },
    isLoading,
    refetch,
  } = useQuery<{
    account_reporter_and_family_statement_list: Array<{
      account_number: string
      bank_name: string
      is_family: boolean
      name: string
    }>
  }>({
    queryKey: ['accountBankList', currency.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.STATEMENT_LIST}/${id}/family/list`,
        {
          params: {
            currency: currency.id ? currency.id : undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnWindowFocus: false,
  })
  const bankAccountOptions = currency.id
    ? data.account_reporter_and_family_statement_list.map((item) => ({
        value: item.account_number,
        label: `${item.name} - ${item.bank_name} - ${item.account_number}`,
      }))
    : [{ value: '', label: 'Semua Akun Bank' }]

  const method: any =
    transactionType.id == 'IN'
      ? transactionMethodOptions.filter((el) => el.id !== 'DEBET BANK')
      : transactionType.id == 'OUT'
      ? transactionMethodOptions.filter((el) => el.id !== 'KREDIT BANK')
      : transactionMethodOptions

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Filter Transaksi</h2>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormItem label="Periode">
            <DatePickerRange
              selected={selectedDate}
              onRangeChange={handleChangeDate}
            />
          </FormItem>
        </div>
        <div className="flex-1">
          <FormItem label="Mata Uang">
            <InputDropdown
              options={currencyOptions}
              value={currency}
              onChange={(props) => {
                setCurrency(props)
                setSelectedBank([])
              }}
            />
          </FormItem>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormItem label="Bank PN">
            <ReactSelect
              isMulti
              value={selectedBank}
              name="banks"
              placeholder="Pilih akun bank..."
              options={bankAccountOptions}
              onChange={(props) => setSelectedBank(props)}
              className="react-select-container"
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

      <div className="flex space-x-4">
        <div className="w-1/2">
          <FormItem label="Min. Nominal Transaksi">
            <Input
              type="text"
              className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={
                minMutation == 0 ? '' : thousandSeparator(minMutation || 0)
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '')
                const value = Number(rawValue)
                if (value >= 0) {
                  setMinMutation(value)
                  if (value > Number(maxMutation)) {
                    setMaxMutation(value)
                  }
                }
              }}
              placeholder="Masukkan nominal transaksi..."
            />
          </FormItem>
        </div>
        <div className="w-1/2">
          <FormItem label="Maks. Nominal Transaksi">
            <Input
              type="text"
              className="w-full px-3 py-2 text-sm mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={maxMutation == 0 ? '' : thousandSeparator(maxMutation)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '')
                const value = Number(rawValue)
                if (value >= 0) {
                  setMaxMutation(value)
                }
                if (value < Number(minMutation)) {
                  setMinMutation(value)
                }
              }}
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
          <FormItem label="Tanda Transaksi">
            <InputDropdown
              placeholder="Pilih tanda..."
              options={highlightOptions}
              value={highlight}
              onChange={(option) => setHighlight(option)}
            />
          </FormItem>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormItem label="Metode Transaksi">
            <InputDropdown
              placeholder="Pilih metode transaksi..."
              options={[{ id: '', label: 'Semua Transaksi' }, ...method]}
              value={transactionMethod}
              onChange={(option) => setTransactionMethod(option)}
            />
          </FormItem>
        </div>
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:opacity-80"
          onClick={() => {
            onClose()
            setSelectedDate({
              from: initialDate?.from,
              to: initialDate?.to,
            })

            setHighlight(
              highlightOptions.find((el) => el.id === initialIsHighlight) ||
                highlightOptions[0]
            )
            setCategory(
              mockCategoryOptions.find((el) => el.id === initialCategory) || {
                id: '',
                label: 'Semua Transaksi',
              }
            )
            setTransactionMethod(
              transactionMethodOptions.find(
                (el) => el.id === initialTransactionMethod
              ) || {
                id: '',
                label: 'Semua Transaksi',
              }
            )
            setTransactionType(
              transactionTypeOptions.find(
                (el) => el.id === initialTransactionType
              ) || transactionTypeOptions[0]
            )
            setMinMutation(initialMinMutation || 0)
            setMaxMutation(initialMaxMutation || 0)

            setSelectedBank(
              initialSelectedBank.length ? initialSelectedBank : []
            )
            setCurrency(
              currencyOptions.find((el) => el.id === initialCurrency) ||
                currencyOptions[0]
            )
          }}
        >
          Batal
        </button>
        <Button
          variant="white-outline"
          onClick={() => {
            setSelectedDate({
              from: undefined,
              to: undefined,
            })
            setCurrency({
              id: '',
              label: 'Semua Mata Uang',
            })
            setTransactionMethod({
              id: '',
              label: 'Semua Transaksi',
            })
            setCategory({
              id: '',
              label: 'Semua Transaksi',
            })
            setTransactionType({
              id: '',
              label: 'Semua Transaksi',
            })
            setHighlight({
              id: '',
              label: 'Semua Transaksi',
            })
            setSelectedBank([])

            const filterValues: FilterValues = {
              startDate: undefined,
              endDate: undefined,
              transactionType: '',
              minMutation: 0,
              maxMutation: 0,
              isHighlight: '',
              selectedBank: [],
              currency: '',
              transactionMethod: '',
              category: '',
            }
            onApplyFilter(filterValues)
            onClose()
          }}
        >
          Reset Filter
        </Button>
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
