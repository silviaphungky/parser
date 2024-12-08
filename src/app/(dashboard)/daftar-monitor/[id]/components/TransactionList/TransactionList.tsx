'use client'
import { Card, Pagination, SearchDropdown } from '@/components'
import { TransactionFilter, TransactionTable } from './components'
import { useEffect, useState } from 'react'
import { IconDownload, IconFilter } from '@/icons'
import { useParams } from 'next/navigation'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@/components/Button'
import useDebounce from '@/utils/useDebounce'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { MultiValue } from 'react-select'

const searchFields = [
  { label: 'Nama Lawan Transaksi', id: 'search_entity_name' },
  { label: 'Remark', id: 'search' },
]

const transactionTypeOptions = [
  { id: '', label: 'Semua Transaksi' },
  { id: 'IN', label: 'Credit' },
  { id: 'OUT', label: 'Debit' },
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

export interface ITransactionItem {
  amount: number
  balance: number
  category_name: string
  category_name_adjusted: string
  date: string
  description: string
  direction: 'IN' | 'OUT'
  entity_account_number: string
  entity_account_number_adjusted: string
  entity_account_number_verified: string
  entity_bank: string
  entity_bank_adjusted: string
  entity_bank_label: string
  entity_bank_label_adjusted: string
  entity_bank_label_verified: string
  entity_bank_verified: string
  entity_name_verified: string
  entity_name: string
  entity_name_adjusted: string
  is_starred: boolean
  method: string
  is_entity_verified: boolean
  note: string
  statement_id: string
  transaction_id: string
  currency: string
  owner_name: string
  owner_account_number: string
  owner_bank: string
  personalBankName: string
  personalBankAccName: string
  personalBankAccNo: string
  time?: string
}

const TransactionList = ({
  token,
  baseUrl,
  verifyBankAccount,
}: {
  token: string
  baseUrl: string
  verifyBankAccount: ({
    transaction_id,
  }: {
    transaction_id: string
  }) => Promise<{ isSuccess: boolean; error?: string; data?: any }>
}) => {
  const { id } = useParams()
  const [countSelectedFilter, setCountSelectedFilter] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>(undefined)
  const [itemsPerPage, setItemPerPage] = useState(20)
  const [isOpen, setIsOpen] = useState(false)
  const [searchBy, setSearchBy] = useState('')
  const [keyword, setKeyword] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [transactionMethod, setTransactionMethod] = useState('')
  const [currency, setCurrency] = useState('')
  const [isHighlight, setIsHighlight] = useState<boolean | string>('')
  const [category, setCategory] = useState<string>('')
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
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)

  useEffect(() => {
    let count = 0
    if (currency) count++
    if (selectedBank.length) count++
    if (selectedDate.from) count++
    if (isHighlight) count++
    if (transactionType) count++
    if (category) count++
    if (transactionMethod) count++
    if (minAmount > 0) count++
    if (maxAmount > 0) count++

    setCountSelectedFilter(count)
  }, [
    currency,
    selectedBank,
    selectedDate,
    transactionType,
    isHighlight,
    transactionMethod,
    category,
    minAmount,
    maxAmount,
  ])

  const handleSearch = (query: string, field: string) => {
    setKeyword(query)
    setSearchBy(field)
  }

  const debouncedValue = useDebounce(keyword, 500)

  const {
    data = { transaction_list: [], meta_data: { total: 1, total_page: 1 } },
    isLoading,
    refetch,
    isFetching,
  } = useQuery<{
    transaction_list: Array<ITransactionItem>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: [
      'transactionList',
      currentPage,
      itemsPerPage,
      id,
      sortBy,
      sortDir,
      debouncedValue,
      isHighlight,
      currency,
      transactionType,
      category,
      transactionMethod,
      minAmount,
      maxAmount,
      selectedDate,
      selectedBank,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URL.TRANSACTION_LIST}`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          account_reporter_id: id,
          [searchBy]:
            debouncedValue.toLowerCase() === 'unknown' ? '' : debouncedValue,
          is_starred: isHighlight === '' ? undefined : isHighlight,
          currency: currency ? currency : undefined,
          category: category ? category : undefined,
          direction: transactionType,
          method: transactionMethod ? [transactionMethod] : undefined,
          sort_by: sortBy,
          sort: sortDir,
          minimum_amount: minAmount > 0 ? minAmount : undefined,
          maximum_amount: maxAmount > 0 ? maxAmount : undefined,
          start_period: selectedDate.from
            ? dayjs(new Date(selectedDate.from)).format('yyyy-mm-dd')
            : undefined,
          end_period: selectedDate.to
            ? dayjs(new Date(selectedDate.to)).format('yyyy-mm-dd')
            : undefined,
          account_number: selectedBank.map((item) => item.value),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = response.data
      return data.data
    },
    refetchOnWindowFocus: false,
  })

  const { mutate: downloadCsv, isPending: isDownloading } = useMutation({
    mutationFn: (payload: {
      account_reporter_id: string
      start_period?: string
      end_period?: string
      page?: number
      limit?: number
      search?: string
      search_entity_name?: ''
      minimum_amount?: 0.0
      maximum_amount?: 0.0
      direction?: 'IN' | 'OUT'
      currency?: ''
      is_starred?: boolean
      category?: ''
      sort_by?: ''
      sort?: ''
      statement_id?: Array<string>
      account_number?: Array<string>
    }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.GENERATE_TRANSACTION_CSV}`,
        {
          ...payload,
          page: currentPage,
          limit: itemsPerPage,
          account_reporter_id: id,
          [searchBy]:
            debouncedValue.toLowerCase() === 'unknown' ? '' : debouncedValue,
          is_starred: isHighlight === '' ? undefined : isHighlight,
          currency: currency ? currency : undefined,
          category: category ? category : undefined,
          direction: transactionType,
          method: transactionMethod ? [transactionMethod] : undefined,
          sort_by: sortBy,
          sort: sortDir,
          minimum_amount: minAmount > 0 ? minAmount : undefined,
          maximum_amount: maxAmount > 0 ? maxAmount : undefined,
          start_period: selectedDate.from
            ? dayjs(new Date(selectedDate.from)).format('yyyy-mm-dd')
            : undefined,
          end_period: selectedDate.to
            ? dayjs(new Date(selectedDate.to)).format('yyyy-mm-dd')
            : undefined,
          account_number: selectedBank.map((item) => item.value),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const { data: wlInfo, isLoading: isLoadingWlInfo } = useQuery<{
    created_at: string
    id: string
    name: string
    newest_statement_period: string
    nik: string
    oldest_statement_period: string
    updated_at: string
  }>({
    queryKey: ['wlInfo', id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${baseUrl}/${API_URL.PN}/${id}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnWindowFocus: false,
  })

  const handleDownloadFile = () => {
    downloadCsv(
      {
        account_reporter_id: id as string,
      },
      {
        onSuccess: ({ data }) => {
          const blob = new Blob([data], { type: 'text/csv' })

          // Generate a download URL
          const url = window.URL.createObjectURL(blob)

          // Create a temporary anchor element to trigger the download
          const link = document.createElement('a')
          link.href = url
          link.download = `transaksi ${wlInfo?.nik} ${dayjs(new Date()).format(
            'DD MMMM YYYY'
          )}.csv`
          document.body.appendChild(link)
          link.click()
        },
        onError: (error: any) => {
          toast.error(`Gagal ekspor ke csv: ${error?.response?.data?.message}`)
        },
      }
    )
  }

  useEffect(() => {
    if (!!debouncedValue) {
      setCurrentPage(1)
    }
  }, [debouncedValue, searchBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  useEffect(() => {
    setKeyword('')
  }, [searchBy])

  return (
    <div>
      <Card className="mb-6">
        {isOpen && (
          <TransactionFilter
            token={token}
            baseUrl={baseUrl}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false)
            }}
            date={selectedDate}
            transactionType={transactionType}
            minMutation={minAmount}
            maxMutation={maxAmount}
            isHighlight={isHighlight}
            bank={selectedBank}
            currency={currency}
            category={category}
            transactionMethod={transactionMethod}
            onApplyFilter={(value) => {
              const {
                startDate,
                endDate,
                transactionType,
                minMutation,
                maxMutation,
                isHighlight,
                selectedBank,
                currency,
                category,
                transactionMethod,
              } = value
              setSelectedDate({
                from: startDate,
                to: endDate,
              })
              setCurrency(currency)
              setSelectedBank(selectedBank)
              setIsHighlight(isHighlight)
              setTransactionType(transactionType)
              setCategory(category)

              setTransactionMethod(transactionMethod)
              setMinAmount(Number(minMutation))
              setMaxAmount(Number(maxMutation))
            }}
            currencyOptions={currencyOptions}
            transactionTypeOptions={transactionTypeOptions}
          />
        )}
        <div className="mb-4 flex justify-between">
          <div>
            <SearchDropdown
              searchFields={searchFields}
              onSearch={handleSearch}
              placeholder="Cari transaksi..."
            />
          </div>
          <div className="flex gap-4 w-[26rem] justify-end">
            <Button
              variant="white-outline"
              className={`w-[7.5rem]  `}
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
            </Button>
            <Button
              loading={isDownloading || isLoading}
              variant="dark"
              onClick={handleDownloadFile}
              disabled={!data?.transaction_list?.length || isLoadingWlInfo}
            >
              <div className="flex gap-2 items-center">
                Ekspor ke CSV
                <IconDownload size={16} color="white" />
              </div>
            </Button>
          </div>
        </div>
        <TransactionTable
          token={token}
          baseUrl={baseUrl}
          refetch={refetch}
          transactionList={data?.transaction_list || []}
          isLoading={isLoading || isFetching}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
          verifyBankAccount={verifyBankAccount}
        />
        {data?.transaction_list?.length > 0 && (
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

export default TransactionList
