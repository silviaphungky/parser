'use client'
import { colorToken } from '@/constants/color-token'
import { IconSearch } from '@/icons'
import { useState } from 'react'

interface Props {
  onSearch: (query: string) => void // Function to handle search input and selected field
  placeholder?: string // Optional placeholder for input
  className?: string
}

const InputSearch = ({
  onSearch,
  placeholder = 'Search...',
  className,
}: Props) => {
  const [query, setQuery] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <div
      className={`flex items-center border border-gray-300 rounded w-[15rem]  ${className}`}
    >
      <div className="ml-2">
        <IconSearch size={18} color={colorToken.grayNusantara} />
      </div>
      <input
        type="text"
        className={`w-[15rem] ${className} px-3 py-1 bg-white rounded-md text-sm border-l-0 rounded-l-none focus:outline-none`}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default InputSearch
