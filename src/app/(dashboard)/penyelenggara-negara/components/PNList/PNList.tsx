'use client'
import { Card, Pagination } from '@/components'
import PNListHeader from '../PNListHeader/PNListHeader'
import PNTable, { Person } from '../PNTable'
import { useEffect, useState } from 'react'
import { API_URL } from '@/constants/apiUrl'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '@/utils/useDebounce'
import axiosInstance from '@/utils/axiosInstance'
import { baseUrl } from '../../[id]/components/UploadBankStatement/UploadBankStatement'

const PNList = ({ token }: { token: string }) => {
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce(keyword, 500)
  const {
    data = {
      account_reporter_list: [],
      meta_data: { total: 0, limit: 0, current_page: 0, total_page: 0 },
    },
    isLoading,
    refetch,
  } = useQuery<{
    account_reporter_list: Array<Person>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: ['pnList', page, perPage, debouncedValue, sortBy, sortDir],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${baseUrl}/${API_URL.PN_LIST}`,
        {
          params: {
            page,
            limit: perPage,
            search: debouncedValue,
            sort_by: sortBy,
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
    if (debouncedValue) {
      setPage(1)
    }
  }, [debouncedValue, perPage])

  return (
    <div>
      <PNListHeader token={token} refetch={refetch} />
      <Card className="w-full mt-6">
        <PNTable
          isLoading={isLoading}
          pnList={data.account_reporter_list}
          token={token}
          refetch={refetch}
          setKeyword={setKeyword}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
        />

        {!isLoading && data.account_reporter_list.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={data.meta_data.total_page}
            totalItems={data.meta_data.total}
            itemsPerPage={perPage}
            onPageChange={setPage}
            onItemsPerPageChange={setPerPage}
          />
        )}
      </Card>
    </div>
  )
}
export default PNList
