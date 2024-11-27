'use client'
import { Card, Pagination } from '@/components'
import {
  TransactionStatementsTable,
  TransactionStatementsFilter,
} from './components'
import { useEffect, useState } from 'react'
import { IconFilter, IconRefresh } from '@/icons'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import Button from '@/components/Button'
import { MultiValue } from 'react-select'
import dayjs from 'dayjs'

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

  {
    id: 'GBP',
    label: 'GBP',
  },
  {
    id: 'JPY',
    label: 'JPY',
  },
  {
    id: 'SGD',
    label: 'SGD',
  },
  {
    id: 'USD',
    label: 'USD',
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
  const [currency, setCurrency] = useState('')
  const [selectedDate, setSelectedDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedBank, setSelectedBank] = useState<
    MultiValue<{ value: string; label: string }>
  >([])

  const [status, setSelectedStatus] = useState('')
  const [countSelectedFilter, setCountSelectedFilter] = useState(0)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()
  let accountBanks = selectedBank.map((item) => {
    return item.value ? item.value : undefined
  })

  const {
    data = { statement_list: [], meta_data: { total_page: 1, total: 2 } },
    isLoading,
    refetch,
    isFetching,
  } = useQuery<{
    statement_list: Array<IStatement>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: [
      'statementList',
      currentPage,
      itemsPerPage,
      selectedBank,
      selectedDate.from,
      selectedDate.to,
      currency,
      status,
      sortBy,
      sortDir,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.STATEMENT_LIST}/${id}/list`,
        {
          params: {
            currency: currency ? currency : undefined,
            status: status ? status : undefined,
            start_period: selectedDate.from
              ? dayjs(new Date(selectedDate.from)).format('YYYY-MM-DD')
              : undefined,
            end_period: selectedDate.to
              ? dayjs(new Date(selectedDate.to)).format('YYYY-MM-DD')
              : undefined,
            account_number: accountBanks,
            sort_by: sortBy === 'period' ? 'start_period' : sortBy,
            sort: sortDir,
          },
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

  useEffect(() => {
    let count = 0
    if (currency) count++
    if (selectedBank.length) count++
    if (selectedDate.from) count++
    if (status) count++
    setCountSelectedFilter(count)
  }, [currency, selectedBank, selectedDate, status])

  return (
    <div>
      <Card className="mb-8">
        <div className="flex items-center">
          <TransactionStatementsFilter
            token={token}
            isOpen={isOpen}
            currencyOptions={currencyOptions}
            onClose={() => setIsOpen(false)}
            onApplyFilter={(value) => {
              const { currency, selectedBank, startDate, endDate, status } =
                value
              setCurrency(currency)
              setSelectedBank(selectedBank)
              setSelectedDate({
                from: startDate,
                to: endDate,
              })
              setSelectedStatus(status)
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
                {countSelectedFilter > 0 && (
                  <div className="bg-black rounded px-2 text-white text-xs">
                    {countSelectedFilter}
                  </div>
                )}
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
          setSortBy={setSortBy}
          setSortDir={setSortDir}
        />
        {data?.statement_list?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.meta_data.total_page || 1}
            onPageChange={setCurrentPage}
            totalItems={data?.meta_data.total || 1}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemPerPage}
          />
        )}
      </Card>
    </div>
  )
}

export default TransactionStatementList
