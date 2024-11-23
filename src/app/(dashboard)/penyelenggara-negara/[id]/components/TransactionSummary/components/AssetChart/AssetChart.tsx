import IconWallet from '@/icons/IconWallet'
import { transactionData } from '../../TransactionSummary'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { AreaChart, Card, Shimmer } from '@/components'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import dayjs from 'dayjs'
import axiosInstance from '@/utils/axiosInstance'

const data = [
  {
    name: 'Jan 2024',
    bca: 4000,
    bni: 2400,
    mandiri: 2400,
  },
  {
    name: 'Feb 2024',
    bca: 3000,
    bni: 1398,
    mandiri: 2210,
  },
  {
    name: 'March 2024',
    bca: 2000,
    bni: 9800,
    mandiri: 2290,
  },
  {
    name: 'April 2024',
    bca: 2780,
    bni: 3908,
    mandiri: 2000,
  },
  {
    name: 'May 2024',
    bca: 1890,
    bni: 4800,
    mandiri: 2181,
  },
  {
    name: 'June 2024',
    bca: 2390,
    bni: 3800,
    mandiri: 2500,
  },
  {
    name: 'July 2024',
    bca: 3490,
    bni: 4300,
    mandiri: 2100,
  },
]

const AssetChart = ({
  selectedCurrency,
  selectedDate,
  token,
}: {
  selectedCurrency: {
    id: string | number
    label: string
  }
  selectedDate: {
    from: Date | undefined
    to: Date | undefined
  }
  token: string
}) => {
  const { id } = useParams()
  const {
    data: chartData,
    isLoading,
    isFetching,
  } = useQuery<{
    transaction_list: Array<any>
  }>({
    queryKey: [
      'chartData',
      selectedDate.from,
      selectedDate.to,
      selectedCurrency.id,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TOP_TRANSACTION}/${id}/summary/line-chart`,

        {
          params: {
            start_period: dayjs(selectedDate.from).format('YYYY-MM-DD'),
            end_period: dayjs(selectedDate.to).format('YYYY-MM-DD'),
            currency: selectedCurrency.id,
            group_by: 'weekly',
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

  return (
    <Card className="flex-1">
      <div className="flex gap-2">
        <div className="p-1 bg-[#2767bd80] rounded-lg h-[2.25rem]">
          <IconWallet color="white" size={26} />
        </div>
        <div>
          <div className="text-sm">Saldo</div>
          <div className="text-xl font-bold">{`Rp ${thousandSeparator(
            transactionData.balance.total || 0
          )}`}</div>
        </div>
      </div>
      <div className="mt-4">
        {(isLoading || isFetching) && <Shimmer />}
        {!isLoading && !isFetching && (
          <AreaChart
            data={data}
            height={300}
            width={500}
            yLegend="saldo"
            xAxis="name"
          />
        )}
      </div>
    </Card>
  )
}

export default AssetChart
