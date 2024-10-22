'use client'

import { useState } from 'react'
import InputDropdown from '../InputDropdown'
import { IconSearch } from '@/icons'
import { colorToken } from '@/constants/color-token'

interface SearchDropdownProps {
  searchFields: { label: string; id: string | number }[] // Array of dropdown options
  onSearch: (query: string, field: string) => void // Function to handle search input and selected field
  placeholder?: string // Optional placeholder for input
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchFields,
  onSearch,
  placeholder = 'Search...',
}) => {
  const [selectedField, setSelectedField] = useState<{
    label: string
    id: string | number
  }>(searchFields[0])
  const [query, setQuery] = useState('')

  const handleFieldChange = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedField(option)
    onSearch(query, option.id as string) // Call onSearch when the field changes
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery, selectedField.id as string) // Call onSearch when the query changes
  }

  return (
    <div className="flex items-center border border-gray-300 rounded w-[27rem]">
      {/* Dropdown for selecting search field */}
      <div className="w-[16rem] ">
        <InputDropdown
          value={selectedField}
          options={searchFields}
          onChange={handleFieldChange}
          className="ring-0 border-0"
        />
      </div>
      <div className="h-[1.5rem] border-l" />
      <div className="ml-2">
        <IconSearch size={18} color={colorToken.grayNusantara} />
      </div>
      <input
        type="text"
        className="w-[15rem] pr-3 pl-2  bg-white rounded-md text-sm border-l-0 rounded-l-none focus:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchDropdown
