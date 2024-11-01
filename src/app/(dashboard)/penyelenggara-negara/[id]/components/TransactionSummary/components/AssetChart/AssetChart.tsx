import IconWallet from '@/icons/IconWallet'
import { transactionData } from '../../TransactionSummary'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { AreaChart, Card } from '@/components'

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

const AssetChart = () => {
  return (
    <Card className="flex-1">
      <div className="flex gap-2">
        <div className="p-1 bg-[#2767bd80] rounded-lg h-[2.25rem]">
          <IconWallet color="white" size={26} />
        </div>
        <div>
          <div className="text-sm">Saldo</div>
          <div className="text-xl font-bold">{`Rp ${thousandSeparator(
            transactionData.balance.total
          )}`}</div>
        </div>
      </div>
      <div className="mt-4">
        <AreaChart
          data={data}
          height={300}
          width={500}
          yLegend="saldo"
          xAxis="date"
        />
      </div>
    </Card>
  )
}

export default AssetChart
