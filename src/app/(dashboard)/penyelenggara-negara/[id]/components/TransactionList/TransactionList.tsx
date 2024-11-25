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
import { baseUrl } from '../UploadBankStatement/UploadBankStatement'
import useDebounce from '@/utils/useDebounce'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const searchFields = [
  { label: 'Nama Akun Lawan Transaksi', id: 'search_entity_name' },
  { label: 'Remark', id: 'search' },
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
  entity_bank: string
  entity_bank_adjusted: string
  entity_bank_label: string
  entity_bank_label_adjusted: string
  entity_name: string
  entity_name_adjusted: string
  is_starred: boolean
  method: string
  note: string
  statement_id: string
  transaction_id: string
  currency: string
  remark?: string
  // NOTE: temp
  personalBankName: string
  personalBankAccName: string
  personalBankAccNo: string
  time?: string
}

const TransactionList = ({ token }: { token: string }) => {
  const { id } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>(undefined)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [isOpen, setIsOpen] = useState(false)
  const [searchBy, setSearchBy] = useState('')
  const [keyword, setKeyword] = useState('')

  const handleSearch = (query: string, field: string) => {
    setKeyword(query)
    setSearchBy(field)
  }

  const debouncedValue = useDebounce(keyword, 500)

  const { data, isLoading, refetch, isFetching } = useQuery<{
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
      searchBy,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TRANSACTION_LIST}`,

        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            account_reporter_id: id,
            [searchBy]: debouncedValue,
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
      const response = await axiosInstance.get(`${API_URL.PN}/${id}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const handleDownloadFile = () => {
    downloadCsv(
      {
        account_reporter_id: id as string,
        search: '',
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
          )}.csv` // Desired filename
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
    setCurrentPage(1)
  }, [debouncedValue, searchBy, itemsPerPage])

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
            <Button
              variant="white-outline"
              className={`w-[7.5rem]  `}
              onClick={() => setIsOpen(true)}
            >
              <div className="flex gap-2 items-center justify-center">
                <div>Filter</div>
                <div className="bg-black rounded px-2 text-white text-xs">
                  2
                </div>
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
          refetch={refetch}
          transactionList={data?.transaction_list || []}
          isLoading={isLoading || isFetching}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
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

export default TransactionList
