'use client'
import { Card, Pagination } from '@/components'
import {
  TransactionStatementsTable,
  TransactionStatementsFilter,
} from './components'
import { useState } from 'react'
import { IconFilter, IconSort } from '@/icons'
import InputDropdown from '@/components/InputDropdown'

const sortOptions = [
  { label: 'Tanggal Laporan Bank - Paling baru', id: 'bankStatementDate' },
  { label: 'Tanggal Laporan Bank - Paling lama', id: '-bankStatementDate' },
  { label: 'Tanggal Unggah - Paling baru', id: 'uploadedAt' },
  { label: 'Tanggal Unggah - Paling lama', id: '-uploadedAt' },
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

const TransactionStatementList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<{
    id: string | number
    label: string
  }>({ id: '', label: '' })

  const handleSort = (option: { id: string | number; label: string }) => {
    setSelectedSort(option)
  }

  return (
    <div>
      <Card className="mb-8">
        <TransactionStatementsFilter
          isOpen={isOpen}
          bankOptions={bankOptions}
          currencyOptions={currencyOptions}
          onClose={() => setIsOpen(false)}
          onApplyFilter={(value) => {
            console.log({ value })
          }}
        />
        <div className="mb-4 flex justify-end">
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
        <TransactionStatementsTable />
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

export default TransactionStatementList
