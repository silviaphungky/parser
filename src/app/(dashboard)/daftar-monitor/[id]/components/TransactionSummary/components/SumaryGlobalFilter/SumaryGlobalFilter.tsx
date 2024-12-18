import DatePickerRange from '@/components/DatePickerRange'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import ReactSelect, { MultiValue } from 'react-select'
import { currencyOptions } from '../../TransactionSummary'

export const mockBank = [
  { value: 'BCA1', label: 'BCA - 12345678 Anton' },
  { value: 'BCA1', label: 'BCA - 12345678 Anton' },
  { value: 'BNI1', label: 'BNI - 87654321 Siti Aisyah' },
  { value: 'BRI1', label: 'BRI - 11223344 Siti Aisyah' },
]

const SumaryGlobalFilter = ({
  token,
  selectedCurrency,
  selectedBank,
  baseUrl,
  selectedDate,
  handleChangeBank,
  handleChangeCurrency,
  handleChangeDate,
}: {
  token: string
  baseUrl: string
  selectedDate: {
    from: Date | undefined
    to: Date | undefined
  }
  selectedCurrency: { id: string | number; label: string }
  selectedBank: MultiValue<{ value: string; label: string }>
  handleChangeBank: (
    props: MultiValue<{ value: string; label: string }>
  ) => void
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
    queryKey: ['accountBankList', selectedCurrency.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${baseUrl}/${API_URL.STATEMENT_LIST}/${id}/family/list`,
        {
          params: {
            currency: selectedCurrency.id,
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
  const bankAccountOptions =
    data.account_reporter_and_family_statement_list.map((item) => ({
      value: item.account_number,
      label: `${item.name} - ${item.bank_name} - ${item.account_number}`,
    }))

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
          options={bankAccountOptions}
          className="react-select-container"
          placeholder="Pilih akun bank..."
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
            handleChangeBank(props)
          }}
        />
      </div>

      <DatePickerRange
        selected={selectedDate}
        onRangeChange={handleChangeDate}
      />
    </div>
  )
}

export default SumaryGlobalFilter
