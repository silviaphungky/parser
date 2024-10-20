import DatePickerRange from '@/components/DatePickerRange'
import InputDropdown from '@/components/InputDropdown'

export const mockBank = [
  {
    id: '',
    label: 'All banks',
  },
  {
    id: 'bca',
    label: 'BCA',
  },
  {
    id: 'bni',
    label: 'BNI',
  },
  {
    id: 'mandiri',
    label: 'Mandiri',
  },
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
  console.log('masuk')
  console.log({ selectedBank })
  return (
    <div className="mt-4 flex gap-4 justify-end">
      <div className="w-[10rem]">
        <InputDropdown
          value={selectedBank}
          options={mockBank}
          onChange={handleChangeBank}
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
