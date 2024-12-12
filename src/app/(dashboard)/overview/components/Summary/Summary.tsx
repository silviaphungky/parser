'use client'

import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'
import SummaryCard from '../SummaryCard/SummaryCard'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { IconReceipt, IconUsers, IconUserStar } from '@/icons'
import { Shimmer } from '@/components'

const Summary = ({ token, baseUrl }: { token: string; baseUrl: string }) => {
  const {
    data = {
      total_account_reporter: 0,
      total_starred_account_reporter: 0,
      total_statement: 0,
    },
    isLoading,
    refetch,
  } = useQuery<{
    total_account_reporter: number
    total_starred_account_reporter: number
    total_statement: number
  }>({
    queryKey: ['pnOverview'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${baseUrl}/${API_URL.OVERVIEW}`,
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

  return isLoading ? (
    <Shimmer />
  ) : (
    <div className="flex gap-4 flex-1 mt-6">
      <SummaryCard
        title="Total Daftar Monitor dipantau"
        description={thousandSeparator(data.total_account_reporter)}
        icon={
          <div className="bg-[#00b8d928] rounded-full p-4">
            <IconUsers color="#006C9C" />
          </div>
        }
      />
      <SummaryCard
        title="Total Daftar Monitor ditandai"
        description={thousandSeparator(data.total_starred_account_reporter)}
        icon={
          <div className="bg-[#FFE0EB] rounded-full p-4">
            <IconUserStar color="#FF82AC" size={26} />
          </div>
        }
      />
      <SummaryCard
        title="Total Laporan Bank"
        description={thousandSeparator(data.total_statement)}
        icon={
          <div className="bg-[#FFF5D9] rounded-full p-4">
            <IconReceipt color="#FFBB38" />
          </div>
        }
      />
    </div>
  )
}

export default Summary
