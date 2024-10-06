'use client'

import { IconChevronDown } from '@/icons'
import useOutsideClick from '@/utils/useClickOutside'

import { ReactNode, forwardRef, useRef, useState } from 'react'

interface Props {
  value: {
    id: string | number
    label: string
  }
  placeholder?: string
  options: Array<{ id: string | number; label: string; icon?: ReactNode }>
  onChange: ({ id, label }: { id: string | number; label: string }) => void
  disabled?: boolean
  className?: string
}

const InputDropdown = forwardRef<HTMLDivElement, Props>(
  ({ value, onChange, options, placeholder, className, ...props }, ref) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    useOutsideClick(divRef, () => setIsOpen(false))

    const selectedOptions = options.find((el) => el.id === value?.id)

    return (
      <div
        className={`${className} relative inline-block text-left w-full`}
        ref={divRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            disabled={props.disabled}
          >
            <div className="flex gap-2">
              {selectedOptions?.icon}
              {selectedOptions?.label || placeholder}
            </div>
            <IconChevronDown />
          </button>
        </div>
        <div
          className={`absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isOpen && !props.disabled ? 'block' : 'hidden'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-3 px-2 overflow-auto max-h-[180px]" role="none">
            {options.map((item) => {
              return (
                <div
                  key={item.id}
                  className="cursor-pointer p-2 text-sm flex gap-2"
                  onClick={() => onChange(item)}
                  ref={ref}
                >
                  {item.icon}
                  <div>{item.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

InputDropdown.displayName = 'InputDropdown'

export default InputDropdown
