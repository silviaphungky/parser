'use client'

import { colorToken } from '@/constants/color-token'
import { IconChevronDown, IconX } from '@/icons'
import useOutsideClick from '@/utils/useClickOutside'

import { ReactNode, forwardRef, useRef, useState } from 'react'

interface Props {
  value: {
    id: string | number
    label: string
  }
  placeholder?: string | ReactNode
  options: Array<{ id: string | number; label: string; icon?: ReactNode }>
  onChange: ({ id, label }: { id: string | number; label: string }) => void
  disabled?: boolean
  className?: string
  hideChevron?: boolean
  reset?: boolean
}

const InputDropdown = forwardRef<HTMLDivElement, Props>(
  (
    {
      value,
      onChange,
      options,
      placeholder,
      className,
      hideChevron,
      reset,
      ...props
    },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    useOutsideClick(divRef, () => setIsOpen(false))

    const selectedOptions = options.find((el) => el.id === value?.id)

    return (
      <div
        className={`relative inline-block text-left w-full`}
        ref={divRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <button
            type="button"
            className={`${className} ${
              reset && selectedOptions?.id && 'bg-[#EFEFEF]'
            } ${
              !reset && 'hover:bg-gray-50'
            } inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 disabled:bg-gray-100 `}
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            disabled={props.disabled}
          >
            <div className="flex gap-2">
              {selectedOptions?.icon}
              {selectedOptions?.label || placeholder}
            </div>
            {reset && selectedOptions?.label && (
              <div
                onClick={() => onChange({ id: '', label: '' })}
                className="cursor-pointer ml-2"
              >
                <IconX color={colorToken.grayVulkanik} size={20} />
              </div>
            )}
            {!hideChevron && <IconChevronDown />}
          </button>
        </div>
        <div
          className={`min-w-full absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isOpen && !props.disabled ? 'block' : 'hidden'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          style={{ width: 'max-content' }}
        >
          <div className="py-3 px-2 overflow-auto max-h-[180px]" role="none">
            {options.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`cursor-pointer p-2 text-sm flex gap-2 ${
                    selectedOptions?.id === item.id && 'bg-gray-200'
                  }`}
                  onClick={() => {
                    onChange(item)
                  }}
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
