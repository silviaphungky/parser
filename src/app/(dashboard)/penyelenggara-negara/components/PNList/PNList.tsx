'use client'
import { Card, Pagination, Shimmer } from '@/components'
import PNListHeader from '../PNListHeader/PNListHeader'
import PNTable from '../PNTable'
import { useState } from 'react'
import { getPNList } from '@/app/service/getPNList'
import { API_URL } from '@/constants/apiUrl'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '@/utils/useDebounce'

const PNList = ({ token }: { token: string }) => {
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
    account_reporter_list: Array<{
      id: string
      name: string
      nik: string
      bank: Array<'Mandiri' | 'BCA' | 'BRI' | 'BNI'>
      total_statement: number
      total_transaction: number
      total_family_member: number
      created_at: string
      updated_at?: string
      total_bank_account: number
      total_asset?: Array<{
        [key: string]: number
      }>
    }>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: ['pnList', page, perPage, debouncedValue],
    queryFn: async () =>
      await getPNList(
        `${API_URL.PN_LIST}?page=${page}&limit=${perPage}&search=${debouncedValue}`,
        token
      ),
  })

  return (
    <div>
      <PNListHeader token={token} refetch={refetch} />
      <Card className="w-full mt-6">
        {!isLoading && (
          <>
            {data.account_reporter_list.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">
                  Tidak ada data yang tersedia
                </p>
                <p className="text-sm">
                  Tambahkan penyelenggara negara yang akan dimonitor
                </p>
              </div>
            )}
          </>
        )}

        <PNTable
          isLoading={isLoading}
          pnList={data.account_reporter_list}
          token={token}
          refetch={refetch}
          setKeyword={setKeyword}
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
