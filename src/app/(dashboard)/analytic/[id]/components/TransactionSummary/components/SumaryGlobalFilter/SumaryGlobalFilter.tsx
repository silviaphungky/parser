import DatePickerRange from '@/components/DatePickerRange'
import ReactSelect from 'react-select'

export const mockBank = [
  { value: 'BCA1', label: 'BCA - 12345678' },
  { value: 'BCA1', label: 'BCA - 12345678' },
  { value: 'BNI1', label: 'BNI - 87654321' },
  { value: 'BRI1', label: 'BRI - 11223344' },
]

const SumaryGlobalFilter = ({
  selectedBank,
  initialRange,
  handleChangeBank,
  handleChangeDate,
}: {
  selectedBank: { id: string | number; label: string }
  initialRange?: { from: Date | undefined; to: Date | undefined }
  handleChangeBank: ({
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
  return (
    <div className="mt-4 flex gap-4 justify-end">
      <div className="w-[10rem]">
        <ReactSelect
          isMulti
          name="colors"
          options={mockBank}
          className="react-select-container"
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
