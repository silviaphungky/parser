'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const data = [
  { name: '1/10/24', transferOut: 0, transferIn: 2, amt: 2400 },
  { name: '2/10/24', transferOut: 3, transferIn: 0, amt: 2210 },
  { name: '3/10/24', transferOut: 2, transferIn: 9, amt: 2290 },
  { name: '4/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '5/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '6/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '7/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '8/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '9/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '10/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '11/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '12/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
  { name: '13/10/24', transferOut: 3, transferIn: 3, amt: 2000 },
]

export const LEGEND_MAP: { [key in string]: string } = {
  transferIn: 'Transfer In',
  transferOut: 'Transfer Out',
}

const CustomLegendText = (value: string) => {
  return <span style={{ color: '#3B4752' }}>{LEGEND_MAP[value]}</span>
}

const StackedBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="name"
          axisLine={{ stroke: '#E9EFF3' }}
          tickLine={false}
          tick={{ fontSize: '0.75rem' }}
        />
        <YAxis
          axisLine={{ stroke: '#E9EFF3' }}
          tickLine={false}
          tick={{ fontSize: '0.75rem' }}
        />
        <CartesianGrid
          horizontal={true}
          vertical={false}
          strokeDasharray={'3 3'}
          stroke="#E9EFF3"
        />
        <Tooltip />
        <Legend
          align="center"
          wrapperStyle={{
            position: 'relative',
            fontSize: '0.75rem',
          }}
          formatter={CustomLegendText}
        />
        <Bar dataKey="transferIn" stackId="a" fill="#77ED8B" barSize={20} />
        <Bar dataKey="transferOut" stackId="a" fill="#fe8c8c" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default StackedBarChart
