'use client'
import { ReactElement } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart as RPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import Card from '../Card'
import { thousandSeparator } from '@/utils/thousanSeparator'

interface Props {
  chartData: Array<{
    name: string
    value: number
  }>
  value: number
  colorMap: Array<string>
  size?: number
  cx?: number
  label?: (props: any) => string | ReactElement
}

const PieChart = ({ chartData, value, size, colorMap, cx, label }: Props) => {
  return (
    <ResponsiveContainer height={size || 150}>
      <RPieChart>
        <Pie
          animationDuration={100}
          data={chartData}
          startAngle={90}
          endAngle={-270}
          cx={cx || '50%'}
          cy={'50%'}
          innerRadius={'60%'}
          outerRadius={'75%'}
          fill={'#8884d8"'}
          paddingAngle={2}
          stroke={'10'}
          strokeWidth={15}
          cornerRadius={2}
          dataKey="value"
          labelLine={false}
          label={label}
        >
          {chartData.map((entry, index) => {
            return (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={colorMap[index]}
                stroke="10"
                strokeWidth={15}
                opacity={1}
              />
            )
          })}
        </Pie>
        <Legend
          wrapperStyle={{
            fontSize: '0.75rem',
          }}
        />
        <Tooltip
          itemStyle={{ fontSize: 12 }}
          content={({ payload, label, active }) => {
            if (active && payload) {
              const value = payload[0]?.value as string
              return (
                <Card>
                  <div className="text-xs">
                    <div>{label}</div>
                    <div>{thousandSeparator(Number(value))}</div>
                  </div>
                </Card>
              )
            }
            return null
          }}
        />
      </RPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart
