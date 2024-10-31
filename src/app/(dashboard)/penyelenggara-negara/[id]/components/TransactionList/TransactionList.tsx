'use client'
import { Card, FormItem, Modal, Pagination, SearchDropdown } from '@/components'
import { TransactionFilter, TransactionTable } from './components'
import { useState } from 'react'
import InputDropdown from '@/components/InputDropdown'
import { IconFilter, IconSort } from '@/icons'

const searchFields = [
  { label: 'Nama Pemilik Akun', id: 'targetBankName' },
  { label: 'Remark', id: 'remark' },
]

const sortOptions = [
  { label: 'Tanggal Transaksi - Paling baru', id: 'transactionDate' },
  { label: 'Tanggal Transaksi - Paling lama', id: '-transactionDate' },
  { label: 'Nominal Transaksi - Paling tinggi', id: 'mutation' },
  { label: 'Nominal Transaksi - Paling rendah', id: '-mutation' },
]

const transactionTypeOptions = [
  { id: '', label: 'Semua Tipe Transaksi' },
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
    id: 'IDR',
    label: 'IDR',
  },
  { id: 'USD', label: 'USD' },
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
          <SearchDropdown
            searchFields={searchFields}
            onSearch={handleSearch}
            placeholder="Cari transaksi..."
          />
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

            <div className="w-max">
              <InputDropdown
                reset
                value={selectedSort}
                hideChevron
                options={sortOptions}
                placeholder={
                  <div className="flex gap-2 items-center">
                    <div>Urutkan berdasarkan</div>
                    <IconSort />
                  </div>
                }
                onChange={handleSort}
              />
            </div>
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
