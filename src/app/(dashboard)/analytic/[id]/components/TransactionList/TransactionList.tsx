'use client'
import { Card, SearchDropdown } from '@/components'
import { TransactionTable } from './components'
import { useState } from 'react'
import InputDropdown from '@/components/InputDropdown'
import { IconSort } from '@/icons'

const searchFields = [
  { label: 'Personal Bank Name', id: 'personalBankName' },
  { label: 'Remark', id: 'remark' },
  { label: 'Target Bank Name', id: 'targetBankName' },
]

const sortOptions = [
  { label: 'Transaction Date - Newest', id: 'transactionDate' },
  { label: 'Transaction Date - Oldest', id: '-transactionDate' },
  { label: 'Mutation - Highest', id: 'mutation' },
  { label: 'Mutation - Lowest', id: '-mutation' },
]

const TransactionList = () => {
  const [selectedSort, setSelectedSort] = useState<{
    id: string | number
    label: string
  }>({ id: '', label: '' })

  const handleSearch = (query: string, field: string) => {
    // Implement your filtering logic based on the query and field here
    console.log(`Searching for "${query}" in field "${field}"`)
    // Example: Apply search logic to filter your table data and update state
  }

  const handleSort = (option: { id: string | number; label: string }) => {
    setSelectedSort(option)
  }

  return (
    <div>
      <Card>
        {/* filter */}
        <div className="mb-4 flex justify-between">
          <SearchDropdown
            searchFields={searchFields}
            onSearch={handleSearch}
            placeholder="Search transactions..."
          />
          <div>
            <InputDropdown
              reset
              value={selectedSort}
              hideChevron
              options={sortOptions}
              placeholder={
                <div className="flex gap-2 items-center">
                  <div>Sort By</div>
                  <IconSort />
                </div>
              }
              onChange={handleSort}
            />
          </div>
        </div>
        <TransactionTable />
      </Card>
    </div>
  )
}

export default TransactionList
