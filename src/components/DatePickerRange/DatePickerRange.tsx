import { IconCalendar } from '@/icons'
import useOutsideClick from '@/utils/useClickOutside'
import dayjs from 'dayjs'
import React, { useState, forwardRef, Ref, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

interface DatePickerRangeProps {
  selected: { from: Date | undefined; to: Date | undefined }
  initialRange?: { from: Date | undefined; to: Date | undefined }
  onRangeChange?: (range: {
    from: Date | undefined
    to: Date | undefined
  }) => void
  className?: string
}

const DatePickerRange = forwardRef<HTMLDivElement, DatePickerRangeProps>(
  (
    {
      selected,
      initialRange = { from: undefined, to: undefined },
      onRangeChange,
      className,
    },
    ref: Ref<HTMLDivElement>
  ) => {
    const divRef = useRef(null)
    const [range, setRange] = useState<{
      from: Date | undefined
      to: Date | undefined
    }>(initialRange)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleDayClick = (day: Date) => {
      if (!range.from || (range.from && range.to)) {
        const newRange = { from: day, to: undefined }
        setRange(newRange)
        onRangeChange?.(newRange) // Call the callback if provided
      } else {
        const newRange = { ...range, to: day }
        setRange(newRange)
        onRangeChange?.(newRange) // Call the callback if provided
      }
    }

    useEffect(() => {
      setRange(selected)
    }, [selected])

    const handleInputClick = () => {
      setIsCalendarOpen((prev) => !prev) // Toggle calendar visibility
    }

    const formatDateRange = () => {
      if (range?.from && range?.to) {
        return `${dayjs(range.from.toLocaleDateString()).format(
          'DD/MM/YYYY'
        )} - ${dayjs(range.to.toLocaleDateString()).format('DD/MM/YYYY')}`
      }
      return 'Pilih rentang waktu'
    }

    useOutsideClick(divRef, () => setIsCalendarOpen(false))

    return (
      <div ref={ref} className={`flex flex-col relative `}>
        <div
          className={`p-2 border border-gray-300 rounded-lg cursor-pointer text-sm w-[14rem] ${className} flex gap-2 cursor-pointer bg-white`}
        >
          <IconCalendar />
          <input
            type="text"
            value={formatDateRange()}
            readOnly
            onClick={handleInputClick}
            className="w-full outline-none cursor-pointer"
          />
        </div>

        {isCalendarOpen && (
          <div
            className="p-4 border border-gray-300 rounded-lg shadow-md absolute bg-white top-[3rem] w-max right-0 z-10 bg-white"
            ref={divRef}
          >
            <DayPicker
              captionLayout="dropdown"
              mode="range"
              selected={range}
              onDayClick={handleDayClick}
              styles={{
                selected: { backgroundColor: 'blue', color: 'white' },
                today: { backgroundColor: 'green', color: 'white' },
              }}
            />
          </div>
        )}
      </div>
    )
  }
)

DatePickerRange.displayName = 'DatePickerRange'

export default DatePickerRange
