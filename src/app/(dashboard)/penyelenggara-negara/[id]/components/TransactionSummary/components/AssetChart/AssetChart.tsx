import IconWallet from '@/icons/IconWallet'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { AreaChart, Card, Shimmer } from '@/components'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import dayjs from 'dayjs'
import axiosInstance from '@/utils/axiosInstance'

const colorMap = [
  'rgb(112, 219, 255, 0.6)',
  'rgb(51, 87, 255, 0.6)',
  'rgb(255, 51, 161, 0.6)',
  'rgb(255, 195, 0, 0.6)',
  'rgb(255, 87, 51, 0.6)',
  'rgb(218, 247, 166, 0.6)',
  'rgb(88, 24, 69, 0.6)',
  'rgb(199, 0, 57, 0.6)',
  'rgb(255, 141, 26, 0.6)',
  'rgb(223, 255, 0, 0.6)',
  'rgb(255, 87, 51, 0.6)',
  'rgb(64, 224, 208, 0.6)',
  'rgb(51, 255, 87, 0.6)',
  'rgb(144, 12, 63, 0.6)',
  'rgb(100, 149, 237, 0.6)',
  'rgba(23, 190, 207, 0.8)',
  'rgb(210, 105, 30, 0.6)',
  'rgb(138, 43, 226, 0.6)',
  'rgb(222, 49, 99, 0.6)',
  'rgb(106, 90, 205, 0.6)',
  'rgb(255, 99, 71, 0.6)',
  'rgba(44, 160, 44, 0.8)',
  'rgba(214, 39, 40, 0.8)',
  'rgba(148, 103, 189, 0.8)',
  'rgba(140, 86, 75, 0.8)',
  'rgba(127, 127, 127, 0.8)',
  'rgba(188, 189, 34, 0.8)',
  'rgba(255, 187, 120, 0.8)',
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
    data: chartData = { total_balance: 0, summary_line_chart: [] },
    isLoading,
    isFetching,
  } = useQuery<{
    total_balance: number
    summary_line_chart: Array<{
      account_number: string
      bank_name: string
      date: string
      name: string
      statement_id: string
      value: number
    }>
  }>({
    queryKey: [
      'chartData',
      selectedDate.from,
      selectedDate.to,
      selectedCurrency.id,
      id,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TOP_TRANSACTION}/${id}/summary/line-chart`,
        {
          params: {
            start_period: selectedDate.from
              ? dayjs(selectedDate.from).format('YYYY-MM-DD')
              : undefined,
            end_period: selectedDate.to
              ? dayjs(selectedDate.to).format('YYYY-MM-DD')
              : undefined,
            currency: selectedCurrency.id,
            group_by: 'daily',
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

  const dataKey =
    chartData.summary_line_chart.length > 0
      ? Object.keys(chartData.summary_line_chart[0])
          .filter((el) => el !== 'date')
          .map((item, i) => ({
            key: item,
            color: colorMap[i],
          }))
      : []

  return (
    <Card className="flex-1">
      <div className="flex gap-2">
        <div className="p-1 bg-[#2767bd80] rounded-lg h-[2.25rem]">
          <IconWallet color="white" size={26} />
        </div>
        <div>
          <div className="text-sm">Saldo</div>
          <div className="text-xl font-bold">{`${
            selectedCurrency.id
          } ${thousandSeparator(chartData.total_balance || 0)}`}</div>
        </div>
      </div>
      <div className="mt-4">
        {(isLoading || isFetching) && <Shimmer />}
        {!isLoading && !isFetching && (
          <AreaChart
            dataKeys={dataKey}
            data={chartData.summary_line_chart || []}
            height={300}
            width={500}
            yLegend="saldo"
            xAxis="date"
          />
        )}
      </div>
    </Card>
  )
}

export default AssetChart
