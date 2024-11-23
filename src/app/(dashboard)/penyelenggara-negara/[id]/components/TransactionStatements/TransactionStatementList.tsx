'use client'
import { Card, Pagination } from '@/components'
import {
  TransactionStatementsTable,
  TransactionStatementsFilter,
} from './components'
import { useState } from 'react'
import { IconFilter, IconRefresh } from '@/icons'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import Button from '@/components/Button'

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

export interface IStatement {
  statement_id: string
  account_reporter_id: string
  name: string
  nik: string
  identifier: Array<{ name: string; number: string }>
  bank_name: string
  bank_short_code: string
  currency: string
  file_url: string
  file_name: string
  start_period: string
  end_period: string
  status: 'FAILED' | 'SUCCESS' | 'PENDING'
  created_at: string
  account_number?: string
}

const TransactionStatementList = ({ token }: { token: string }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()
  const { data, isLoading, refetch, isFetching } = useQuery<{
    statement_list: Array<IStatement>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: ['statementList', currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.STATEMENT_LIST}/${id}/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  return (
    <div>
      <Card className="mb-8">
        <div className="flex items-center">
          <TransactionStatementsFilter
            isOpen={isOpen}
            bankOptions={bankOptions}
            currencyOptions={currencyOptions}
            onClose={() => setIsOpen(false)}
            onApplyFilter={(value) => {
              console.log({ value })
            }}
          />
        </div>
        <div className="mb-6 flex gap-4 justify-end items-center">
          <div className="flex gap-4 justify-end">
            <button
              className={`h-fit w-[7.5rem] rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 `}
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
          <Button
            variant="dark"
            onClick={() => refetch()}
            className="font-light"
          >
            <div className="flex gap-1 items-center">
              Refresh
              <IconRefresh color="white" size={14} />
            </div>
          </Button>
        </div>
        <TransactionStatementsTable
          token={token}
          refetch={refetch}
          statementList={data?.statement_list || []}
          isLoading={isLoading || isFetching}
        />
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
