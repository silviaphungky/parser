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

// const CustomTooltip = ({ active, payload }: { active: any; payload: any }) => {
//   if (active) {
//     const percentage = ((payload[0].value / total) * 100).toFixed(2)
//     return (
//       <div
//         className="custom-tooltip"
//         style={{
//           backgroundColor: '#ffff',
//           padding: '5px',
//           border: '1px solid #cccc',
//           width: '10rem',
//         }}
//       >
//         <label>
//           {`${payload[0].name} : ${thousandSeparator(
//             payload[0].value
//           )} (${percentage}%)`}
//         </label>
//       </div>
//     )
//   }
// }

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
          paddingAngle={4}
          stroke={'10'}
          strokeWidth={15}
          cornerRadius={4}
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
        <Tooltip />
      </RPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart
