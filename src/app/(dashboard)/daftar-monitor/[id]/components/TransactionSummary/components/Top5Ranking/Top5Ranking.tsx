import { Card, LineSeparator, ProgressBar, Shimmer } from '@/components'
import { IconIn, IconOut } from '@/icons'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import dayjs from 'dayjs'
import { MultiValue } from 'react-select'

const TransactionCard = ({
  selectedCurrency,
  isLoading,
  title,
  icon,
  iconBg,
  color,
  data,
}: {
  selectedCurrency: string
  isLoading: boolean
  title: string
  icon: ReactNode
  iconBg: string
  color: string
  data: {
    summary: {
      count_transaction: number
      total_transaction: number
      currency: Array<string>
    }
    summary_entity: Array<{
      currency: Array<string>
      entity_account_number: string
      entity_bank: string
      entity_name: string
      percentage: number
      total_amount: number
    }>
  }
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
              <div className="text-xl font-bold">{`${selectedCurrency} ${thousandSeparator(
                data.summary?.total_transaction || 0
              )}`}</div>
              <div className="text-xs">{`#${thousandSeparator(
                data.summary?.count_transaction || 0
              )} transaksi`}</div>
            </div>
          </div>
          <LineSeparator />
          <div className="mt-4 font-semibold font-barlow text-lg mb-2">
            Transaksi Terbesar
          </div>
          {data.summary_entity?.map((item, index) => {
            return (
              <div key={`topValueIn-${index}`} className="mb-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <strong>{item.entity_name || 'unnamed'}</strong>{' '}
                    {` (${item.entity_bank || 'unknown'} - ${
                      item.entity_account_number === '0000000000'
                        ? 'N/A'
                        : item.entity_account_number
                    })`}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <ProgressBar
                    progress={item.percentage}
                    className={`${color}`}
                  />
                  <div className="text-xs text-gray-600">
                    {`${item.percentage.toFixed(1)}%`}
                  </div>
                </div>
                <div className="font-semibold -mt-1 text-sm">{`${
                  item.currency[0]
                } ${thousandSeparator(item.total_amount || 0)}`}</div>
              </div>
            )
          })}
        </>
      )}
    </Card>
  )
}

const Top5Ranking = ({
  baseUrl,
  selectedCurrency,
  selectedDate,
  token,
  selectedBank,
}: {
  baseUrl: string
  selectedCurrency: {
    id: string | number
    label: string
  }
  selectedDate: {
    from: Date | undefined
    to: Date | undefined
  }
  token: string
  selectedBank: MultiValue<{ value: string; label: string }>
}) => {
  const { id } = useParams()
  const {
    data: top5Data = {
      in: {},
      out: {},
    },
    isLoading,
    isFetching,
  } = useQuery<{
    top5Data: {
      in: {
        summary: {
          count_transaction: number
          total_transaction: number
          currency: Array<string>
        }
        summary_entity: Array<{
          currency: Array<string>
          entity_account_number: string
          entity_bank: string
          entity_name: string
          percentage: number
          total_amount: number
        }>
      }
      out: {
        summary: {
          count_transaction: number
          total_transaction: number
          currency: Array<string>
        }
        summary_entity: Array<{
          currency: Array<string>
          entity_account_number: string
          entity_bank: string
          entity_name: string
          percentage: number
          total_amount: number
        }>
      }
    }
  }>({
    queryKey: [
      'top5',
      selectedDate.from,
      selectedDate.to,
      selectedCurrency.id,
      id,
      selectedBank,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${baseUrl}/${API_URL.TOP_TRANSACTION}/${id}/summary/top`,

        {
          params: {
            start_period: selectedDate.from
              ? dayjs(selectedDate.from).format('YYYY-MM-DD')
              : undefined,
            end_period: selectedDate.to
              ? dayjs(selectedDate.to).format('YYYY-MM-DD')
              : undefined,
            currency: selectedCurrency.id,
            account_number: selectedBank.map((item) => item.value),
          },
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

  const data = top5Data as any

  return (
    <>
      <TransactionCard
        isLoading={isLoading || isFetching}
        data={data?.in || {}}
        title="Transfer Masuk"
        icon={<IconIn color="white" size={26} />}
        iconBg="bg-[#77ED8B]"
        color="bg-[#22C55E]"
        selectedCurrency={selectedCurrency.id as string}
      />

      <TransactionCard
        isLoading={isLoading || isFetching}
        data={data?.out || {}}
        title="Transfer Keluar"
        icon={<IconOut color="white" size={26} />}
        iconBg="bg-[#fe8c8c]"
        color="bg-[#E11711]"
        selectedCurrency={selectedCurrency.id as string}
      />
    </>
  )
}

export default Top5Ranking
