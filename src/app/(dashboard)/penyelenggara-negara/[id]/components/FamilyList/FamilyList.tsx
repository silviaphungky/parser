'use client'
import { Card, Pagination, SearchDropdown } from '@/components'
import { FamilyTable } from './components'
import { useState } from 'react'
import InputDropdown from '@/components/InputDropdown'
import { IconFilter, IconSort } from '@/icons'
import DatePickerRange from '@/components/DatePickerRange'

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

const FamilyList = ({ token }: { token: string }) => {
  const [selectedSort, setSelectedSort] = useState<{
    id: string | number
    label: string
  }>({ id: '', label: '' })
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
      <Card className="mb-8">
        <FamilyTable token={token} />
      </Card>
    </div>
  )
}

export default FamilyList
