'use client'
import {
  Cell,
  Legend,
  Pie,
  PieChart as RPieChart,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  chartData: Array<{
    name: string
    value: number
  }>
  value: number
  color: string
  title?: string
  size?: number
  titleSize?: number
  labelSize?: number
  cx?: number
}

const PieChart = ({
  chartData,
  value,
  title,
  size,
  titleSize,
  labelSize,
  colorsMap,
  cx,
}: Props) => {
  return (
    <ResponsiveContainer height={size || 150}>
      <RPieChart>
        <Pie
          animationDuration={100}
          data={chartData}
          startAngle={90}
          endAngle={-270}
          cx={cx || '45%'}
          cy={'45%'}
          innerRadius={'60%'}
          outerRadius={'80%'}
          fill={'#8884d8"'}
          paddingAngle={0}
          stroke={'10'}
          strokeWidth={15}
          cornerRadius={4}
          dataKey="value"
          labelLine={false}
          label={(props) => (
            <text
              style={{
                fontWeight: 600,
                fontSize: labelSize || '1.375rem',
              }}
              x={props.cx}
              y={props.cy + 5}
              textAnchor="middle"
            >
              {value}%
            </text>
          )}
        >
          {chartData.map((entry, index) => {
            return (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={colorsMap[index]}
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
      </RPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart
