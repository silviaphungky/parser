'use client'
import { Card, Pagination, SearchDropdown } from '@/components'
import { TransactionFilter, TransactionTable } from './components'
import { useState } from 'react'
import { IconFilter } from '@/icons'

const searchFields = [
  { label: 'Nama Akun Lawan Transaksi', id: 'targetBankName' },
  { label: 'Remark', id: 'remark' },
]

const transactionTypeOptions = [
  { id: '', label: 'Semua Transaksi' },
  { id: 'cr', label: 'Credit' },
  { id: 'db', label: 'Debit' },
]

const bankOptions = [
  { value: '', label: 'Semua Akun Bank' },
  { value: 'BCA1', label: 'BCA - 12345678' },
  { value: 'BCA1', label: 'BCA - 12345678' },
  { value: 'BNI1', label: 'BNI - 87654321' },
  { value: 'BRI1', label: 'BRI - 11223344' },
]

const currencyOptions = [
  {
    id: '',
    label: 'Semua Mata Uang',
  },
  {
    id: 'idr',
    label: 'IDR',
  },
  {
    id: 'usd',
    label: 'USD',
  },
  {
    id: 'poundsterling',
    label: 'GBP',
  },
  {
    id: 'sgd',
    label: 'SGD',
  },
  {
    id: 'jpy',
    label: 'JPY',
  },
]

const TransactionList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSort, setSelectedSort] = useState<{
    id: string | number
    label: string
  }>({ id: '', label: '' })
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [isOpen, setIsOpen] = useState(false)

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
      <Card className="mb-6">
        {/* filter */}
        <TransactionFilter
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
          onApplyFilter={(value) => {
            console.log({ value })
          }}
          bankOptions={bankOptions}
          currencyOptions={currencyOptions}
          transactionTypeOptions={transactionTypeOptions}
        />
        <div className="mb-4 flex justify-between">
          <div>
            <SearchDropdown
              searchFields={searchFields}
              onSearch={handleSearch}
              placeholder="Cari transaksi..."
            />
          </div>
          <div className="flex gap-4 w-[26rem] justify-end">
            <button
              className={`w-[7.5rem] rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 `}
              onClick={() => setIsOpen(true)}
            >
              <div className="flex gap-2 items-center justify-center">
                <div>Filter</div>
                <div className="bg-black rounded px-2 text-white text-xs">
                  2
                </div>
                <IconFilter />
              </div>
            </button>
          </div>
        </div>
        <TransactionTable />
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          totalItems={100}
          itemsPerPage={5}
          onItemsPerPageChange={setItemPerPage}
        />
      </Card>
    </div>
  )
}

export default TransactionList
