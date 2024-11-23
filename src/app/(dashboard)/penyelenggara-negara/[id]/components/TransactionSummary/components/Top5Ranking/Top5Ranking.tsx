import { Card, LineSeparator, ProgressBar, Shimmer } from '@/components'
import { IconIn, IconOut } from '@/icons'
import { transactionData } from '../../TransactionSummary'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import dayjs from 'dayjs'

const TransactionCard = ({
  isLoading,
  title,
  icon,
  iconBg,
  color,
  data,
}: {
  isLoading: boolean
  title: string
  icon: ReactNode
  iconBg: string
  color: string
  data: Array<{
    name: string
    bank: string
    bankAccNo: string
    nominal: number
  }>
}) => {
  return (
    <Card className="flex-1">
      {isLoading && <Shimmer />}
      {!isLoading && (
        <>
          <div className="flex gap-2">
            <div className={`p-1 ${iconBg} rounded-lg h-[2.25rem]`}>{icon}</div>
            <div>
              <div className="text-sm">{title}</div>
              <div className="text-xl font-bold">{`Rp ${thousandSeparator(
                transactionData.in.total
              )}`}</div>
              <div className="text-xs">{`#${thousandSeparator(
                transactionData.in.count
              )} transaksi`}</div>
            </div>
          </div>
          <LineSeparator />
          <div className="mt-4 font-semibold font-barlow text-lg mb-2">
            Transaksi Terbesar
          </div>
          {data.map((item, index) => {
            return (
              <div key={`topValueIn-${index}`} className="mb-1">
                <div className="flex justify-between items-center text-sm">
                  <div>{`${item.name} (${item.bank} - ${item.bankAccNo})`}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <ProgressBar
                    progress={(item.nominal / transactionData.in.total) * 100}
                    className={`${color}`}
                  />
                  <div className="text-xs text-gray-600">
                    {`${(
                      (item.nominal / transactionData.in.total) *
                      100
                    ).toFixed(0)}%`}
                  </div>
                </div>
                <div className="font-semibold">{`Rp ${thousandSeparator(
                  item.nominal
                )}`}</div>
              </div>
            )
          })}
        </>
      )}
    </Card>
  )
}

const Top5Ranking = ({
  selectedCurrency,
  selectedDate,
  token,
  data,
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
  data: {
    in: Array<{
      name: string
      nominal: number
      bank: string
      bankAccNo: string
    }>
    out: Array<{
      name: string
      nominal: number
      bank: string
      bankAccNo: string
    }>
  }
}) => {
  const { id } = useParams()
  const {
    data: top5Data,
    isLoading,
    isFetching,
  } = useQuery<{
    data: {
      in: {
        summary: {
          count_transaction: number
          total_transaction: number
          currency: Array<string>
        }
        summary_entity: Array<string>
      }
      out: {
        summary: {
          count_transaction: number
          total_transaction: number
          currency: Array<string>
        }
        summary_entity: Array<string>
      }
    }
  }>({
    queryKey: ['top5', selectedDate.from, selectedDate.to, selectedCurrency.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TOP_TRANSACTION}/${id}/summary/top`,

        {
          params: {
            start_period: dayjs(selectedDate.from).format('YYYY-MM-DD'),
            end_period: dayjs(selectedDate.to).format('YYYY-MM-DD'),
            currency: selectedCurrency.id,
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
    <>
      <TransactionCard
        isLoading={isLoading || isFetching}
        data={data.in}
        title="Transfer Masuk"
        icon={<IconIn color="white" size={26} />}
        iconBg="bg-[#77ED8B]"
        color="bg-[#22C55E]"
      />

      <TransactionCard
        isLoading={isLoading || isFetching}
        data={data.out}
        title="Transfer Keluar"
        icon={<IconOut color="white" size={26} />}
        iconBg="bg-[#fe8c8c]"
        color="bg-[#E11711]"
      />
    </>
  )
}

export default Top5Ranking
