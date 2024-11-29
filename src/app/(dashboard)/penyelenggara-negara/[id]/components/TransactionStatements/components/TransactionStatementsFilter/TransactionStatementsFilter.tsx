'use client'
import { useState } from 'react'
import { FormItem, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import DatePickerRange from '@/components/DatePickerRange'
import ReactSelect, { MultiValue } from 'react-select'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useParams } from 'next/navigation'
import Button from '@/components/Button'

interface FilterValues {
  startDate?: Date
  endDate?: Date
  selectedBank: MultiValue<{ value: string; label: string }>
  currency: string
  status: string | 'FAILED' | 'PENDING' | 'SUCCESS'
}

interface FilterModalProps {
  token: string
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filterValues: FilterValues) => void
  currencyOptions: { id: string | number; label: string }[]
  currency?: string
  bank: MultiValue<{ value: string; label: string }>
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | string
  date?: {
    from: Date | undefined
    to: Date | undefined
  }
}

const statusOptions = [
  { id: '', label: 'Semua Status' },
  { id: 'SUCCESS', label: 'Berhasil' },
  { id: 'PENDING', label: 'Diproses' },
  { id: 'FAILED', label: 'Gagal' },
]

const TransactionStatementsFilter: React.FC<FilterModalProps> = ({
  token,
  isOpen,
  onClose,
  onApplyFilter,
  currencyOptions,
  currency: initialCurrency,
  bank: initialBank,
  status: initialStatus,
  date: initialDate,
}) => {
  const { id } = useParams()
  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: initialDate?.from,
    to: initialDate?.to,
  })
  const [selectedBank, setSelectedBank] = useState<
    MultiValue<{ value: string; label: string }>
  >(initialBank.length > 0 ? initialBank : [])
  const [currency, setCurrency] = useState<{
    id: string | number
    label: string
  }>(
    initialCurrency
      ? currencyOptions.find((el) => el.id === initialCurrency) ||
          currencyOptions[0]
      : currencyOptions[0]
  )
  const [status, setStatus] = useState<{
    id: string | number
    label: string
  }>(
    initialStatus
      ? statusOptions.find((el) => el.id === initialStatus) || statusOptions[0]
      : statusOptions[0]
  )

  const handleApplyFilter = () => {
    const filterValues: FilterValues = {
      startDate: selectedDate.from,
      endDate: selectedDate.to,
      selectedBank,
      currency: currency.id as string,
      status: status.id as string,
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  const bankAccountOptions = currency.id
    ? data.account_reporter_and_family_statement_list.map((item) => ({
        value: item.account_number,
        label: `${item.name} - ${item.bank_name} - ${item.account_number}`,
      }))
    : [{ value: '', label: 'Semua Akun Bank' }]

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Filter Laporan Bank</h2>

      <div>
        <FormItem label="Periode">
          <DatePickerRange
            selected={selectedDate}
            initialRange={{
              from: selectedDate.from,
              to: selectedDate.to,
            }}
            onRangeChange={handleChangeDate}
            className="w-full"
          />
        </FormItem>
      </div>
      <div className="flex gap-4">
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
      <div>
        <FormItem label="Akun Bank">
          <ReactSelect
            isMulti
            name="colors"
            options={bankAccountOptions}
            className="react-select-container"
            placeholder="Pilih akun bank..."
            value={selectedBank}
            styles={{
              option: (styles, state) => ({
                ...styles,
                backgroundColor: state.isSelected ? '#E6EFF5' : '',
                '&:hover': {
                  // overriding hover
                  ...styles, // apply initial styles
                  backgroundColor: '#E6EFF5',
                },
              }),
              indicatorsContainer: (base, props) => {
                return {
                  ...base,
                  alignItems: 'start',
                }
              },
              clearIndicator: (base) => {
                return {
                  ...base,
                  cursor: 'pointer',
                }
              },
              dropdownIndicator: (base) => {
                return {
                  ...base,
                  cursor: 'pointer',
                }
              },
              control: (baseStyles, state) => {
                return {
                  ...baseStyles,
                  borderColor: 'rgb(209, 213, 219)',
                  boxShadow: 'none',
                  borderRadius: '0.375rem',
                  height: '34px',
                  overflow: 'auto',
                }
              },
            }}
            onChange={(props) => {
              setSelectedBank(props)
            }}
          />
        </FormItem>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <FormItem label="Status">
            <InputDropdown
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
          </FormItem>
        </div>
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:opacity-80"
          onClick={() => {
            onClose()
            setSelectedBank(initialBank)
            setSelectedDate({
              from: initialDate?.from,
              to: initialDate?.to,
            })
            setCurrency(
              currencyOptions.find((el) => el.id === initialCurrency) ||
                currencyOptions[0]
            )
            setStatus(
              statusOptions.find((el) => el.id === initialStatus) ||
                statusOptions[0]
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
              label: '',
            })
            setStatus({
              id: '',
              label: '',
            })
            setSelectedBank([])

            const filterValues: FilterValues = {
              startDate: undefined,
              endDate: undefined,
              selectedBank: [],
              currency: '',
              status: '',
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

export default TransactionStatementsFilter
