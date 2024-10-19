import { PieChart } from '@/components'

const data = [
  { name: 'Group A', value: 100 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 120 },
  { name: 'Group F', value: 220 },
  { name: 'Group G', value: 270 },
  { name: 'Group H', value: 150 },
  { name: 'Group I', value: 215 },
  { name: 'Group J', value: 105 },
  { name: 'Group K', value: 233 },
]

const greenColoMap = [
  'rgb(255, 87, 51, 0.8)',
  'rgb(112, 219, 255, 0.8)',

  'rgb(51, 87, 255, 0.8)',
  'rgb(255, 51, 161, 0.8)',
  'rgb(255, 195, 0, 0.8)',
  'rgb(255, 87, 51, 0.8)',
  'rgb(218, 247, 166, 0.8)',
  'rgb(88, 24, 69, 0.8)',
  'rgb(199, 0, 57, 0.8)',
  'rgb(144, 12, 63, 0.8)',
  'rgb(255, 141, 26, 0.8)',
  'rgb(223, 255, 0, 0.8)',
  'rgb(64, 224, 208, 0.8)',
  'rgb(51, 255, 87, 0.8)',
  'rgb(100, 149, 237, 0.8)',
  'rgb(210, 105, 30, 0.8)',
  'rgb(138, 43, 226, 0.8)',
  'rgb(222, 49, 99, 0.8)',
  'rgb(106, 90, 205, 0.8)',
  'rgb(255, 99, 71, 0.8)',
]

const TransactionPieChartFreq = () => {
  return (
    <PieChart
      title="category"
      chartData={data.sort((a, b) => b.value - a.value)}
      value={50}
      size={350}
      colorsMap={greenColoMap}
    />
  )
}

export default TransactionPieChartFreq
