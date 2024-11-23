import DatePickerRange from '@/components/DatePickerRange'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import ReactSelect from 'react-select'

export const mockBank = [
  { value: 'BCA1', label: 'BCA - 12345678 Anton' },
  { value: 'BCA1', label: 'BCA - 12345678 Anton' },
  { value: 'BNI1', label: 'BNI - 87654321 Siti Aisyah' },
  { value: 'BRI1', label: 'BRI - 11223344 Siti Aisyah' },
]

const currencyOptions = [
  {
    id: 'IDR',
    label: 'IDR',
  },
  { id: 'USD', label: 'USD' },
]

const SumaryGlobalFilter = ({
  token,
  selectedCurrency,
  selectedBank,
  initialRange,
  handleChangeBank,
  handleChangeDate,
  handleChangeCurrency,
}: {
  token: string
  selectedCurrency: { id: string | number; label: string }
  selectedBank: { id: string | number; label: string }
  initialRange?: { from: Date | undefined; to: Date | undefined }
  handleChangeBank: ({
    id,
    label,
  }: {
    id: string | number
    label: string
  }) => void
  handleChangeCurrency: ({
    id,
    label,
  }: {
    id: string | number
    label: string
  }) => void
  handleChangeDate?: (range: {
    from: Date | undefined
    to: Date | undefined
  }) => void
}) => {
  const { id } = useParams()

  useEffect(() => {
    handleChangeCurrency(currencyOptions[0])
  }, [])

  const {
    data = { account_reporter_and_family_statement_list: [] },
    isLoading,
    refetch,
  } = useQuery<{
    account_reporter_and_family_statement_list: Array<any>
  }>({
    queryKey: ['accountBankList'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.STATEMENT_LIST}/${id}/family/list`,
        {
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

  return (
    <div className="flex gap-4 justify-end">
      <div className="w-[10rem]">
        <InputDropdown
          options={currencyOptions}
          value={selectedCurrency}
          onChange={handleChangeCurrency}
        />
      </div>
      <div className="w-[25rem]">
        <ReactSelect
          isMulti
          name="colors"
          options={mockBank}
          className="react-select-container"
          placeholder="Pilih akun bank"
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
        />
      </div>

      <DatePickerRange
        initialRange={initialRange}
        onRangeChange={handleChangeDate}
      />
    </div>
  )
}

export default SumaryGlobalFilter
