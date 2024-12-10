'use client'

import {
  YAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  AreaChart as RAreaChart,
  Area,
  Legend,
  Label,
  Text,
} from 'recharts'
import { ReactNode } from 'react'

import { thousandSeparator } from '@/utils/thousanSeparator'
import { Card } from '..'

interface Props {
  data: Array<Record<string | number, string | number>>
  dataKeys: Array<{ key: string; color: string }>
  width?: string | number
  height?: string | number
  yLegend?: string
  xAxis?: string
  hideXAxis?: boolean
  margin?: {
    top?: number
    right?: number
    left?: number
    bottom?: number
  }
}

const AreaChart = ({
  data,
  dataKeys,
  width = '100%',
  height = '100%',
  yLegend = 'price',
  xAxis = 'date',
  hideXAxis = false,
  margin = { top: 10, right: 0, left: 0, bottom: 0 },
}: Readonly<Props>) => {
  return (
    <div
      data-testid="areaChartContainer"
      className="border-b border-b-2 border-lightblue"
    >
      <ResponsiveContainer width={width} height={height}>
        <RAreaChart data={data} margin={margin}>
          {/* X-Axis */}
          <XAxis
            dataKey={xAxis}
            axisLine={true}
            tickLine={true}
            style={{ fontSize: '10px', display: hideXAxis ? 'none' : 'block' }}
            interval="preserveStart"
            tick={{ textAnchor: 'start' }}
            //
          />

          {/* Y-Axis */}

          <YAxis
            name={yLegend}
            type="number"
            domain={['dataMin', 'dataMax']}
            axisLine={true}
            tickLine={true}
            style={{ fontSize: '10px' }}
            tickFormatter={(value) => thousandSeparator(value)}
          >
            <Label angle={-45} />
          </YAxis>

          {/* Tooltip */}
          <Tooltip
            content={({ payload, label, active }) => {
              if (active && payload) {
                const value = payload[0]?.value as string
                return (
                  <Card>
                    <div className="text-xs">
                      <div>{label}</div>
                      <div>
                        {`${yLegend} : ${thousandSeparator(Number(value))}`}
                      </div>
                    </div>
                  </Card>
                )
              }
              return null
            }}
          />

          {/* Gradient Definitions */}
          <defs>
            {dataKeys.map(({ key, color }) => (
              <linearGradient
                key={`custom-color-${key}`}
                id={`custom-color-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="20%" stopColor={color} stopOpacity={0.9} />
                <stop offset="80%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>

          {/* Dynamic Areas */}
          {dataKeys.map(({ key, color }) => (
            <Area
              key={`area-${key}`}
              type="natural"
              dataKey={key}
              fill={`url(#custom-color-${key})`}
              stroke={color}
              strokeWidth={2.5}
            />
          ))}

          {/* Legend */}
          <Legend wrapperStyle={{ fontSize: '12px', marginBottom: '0.5rem' }} />
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaChart
