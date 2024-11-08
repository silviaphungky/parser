import DatePickerRange from '@/components/DatePickerRange'
import InputDropdown from '@/components/InputDropdown'
import { useEffect } from 'react'
import ReactSelect from 'react-select'

export const mockBank = [
  { value: 'BCA1', label: 'BCA - 12345678' },
  { value: 'BCA1', label: 'BCA - 12345678' },
  { value: 'BNI1', label: 'BNI - 87654321' },
  { value: 'BRI1', label: 'BRI - 11223344' },
]

const currencyOptions = [
  {
    id: 'IDR',
    label: 'IDR',
  },
  { id: 'USD', label: 'USD' },
]

const SumaryGlobalFilter = ({
  selectedCurrency,
  selectedBank,
  initialRange,
  handleChangeBank,
  handleChangeDate,
  handleChangeCurrency,
}: {
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
  useEffect(() => {
    handleChangeCurrency(currencyOptions[0])
  }, [])
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
