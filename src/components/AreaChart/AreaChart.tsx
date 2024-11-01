'use client'
import {
  // ReferenceLine,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  AreaChart as RAreaChart,
  Area,
  Legend,
} from 'recharts'

import { ReactNode } from 'react'

import { thousandSeparator } from '@/utils/thousanSeparator'
import { Card } from '..'

export const Flex = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2">{children}</div>
)

interface IconContainerProps {
  isActive?: boolean
  children: ReactNode
}

export const IconContainer = ({ isActive, children }: IconContainerProps) => (
  <div
    className={`cursor-pointer h-8 w-8 flex items-center justify-center rounded ${
      isActive ? 'bg-blue-200' : 'bg-white'
    }`}
  >
    {children}
  </div>
)

interface ConfigContainerProps {
  withBorderTop?: boolean
  children: ReactNode
}

export const ConfigContainer = ({
  withBorderTop,
  children,
}: ConfigContainerProps) => (
  <div
    className={`flex justify-between items-center pb-3 mb-4 border-b border-lightBlue ${
      withBorderTop ? 'border-t border-lightBlue pt-3' : ''
    }`}
  >
    {children}
  </div>
)

interface RangeOptionProps {
  isSelected: boolean
  children: ReactNode
  fontSize: string // If you want to allow for custom font sizes, you could apply this as a style prop or similar.
}

export const RangeOption = ({ isSelected, children }: RangeOptionProps) => (
  <div
    className={`cursor-pointer rounded-md px-2 ${
      isSelected ? 'text-white bg-blue-700' : 'text-black'
    } font-normal`}
  >
    {children}
  </div>
)

interface Props {
  useOptions?: boolean
  // selectedRange: { label: string; key?: string }
  // range: Array<{ label: string; key: string }>
  data: Array<Record<string | number, string | number>>
  // referenceLinePoint: number
  // isUp: boolean
  width?: string | number
  height?: string | number
  yLegend?: string
  xAxis?: string
  hideXAxis?: boolean
  // handleChangeRange: (selected: { label: string; key: string }) => void
  withBorderTop?: boolean
  margin?: {
    top?: number
    right?: number
    left?: number
    bottom?: number
  }
}

function AreaChart({
  // useOptions,
  data,
  // referenceLinePoint,
  width,
  height,
  yLegend,
  xAxis,
  hideXAxis,
  // withBorderTop,
  margin,
}: Readonly<Props>) {
  return (
    <div
      data-testid="areaChartContainer"
      className="border-b border-b-2 border-lightblue"
    >
      {/* <ConfigContainer
        withBorderTop={withBorderTop}
        data-testid="configContainer"
      >
        <Flex>
          {range.map((item) => {
            return (
              <RangeOption
                key={`range-${item.key}`}
                fontSize="0.75rem"
                onClick={() => handleChangeRange(item)}
                isSelected={selectedRange.key === item.key}
              >
                {item.label}
              </RangeOption>
            )
          })}
        </Flex>
      </ConfigContainer> */}
      <ResponsiveContainer width={width ?? '100%'} height={height ?? '100%'}>
        <RAreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: margin?.top ?? 10,
            right: margin?.right ?? 0,
            left: margin?.left ?? 0,
            bottom: margin?.bottom ?? 0,
          }}
        >
          <XAxis
            dataKey={xAxis ?? 'name'}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '10px', display: hideXAxis ? 'none' : 'block' }}
            interval="preserveStartEnd"
          />
          <YAxis
            name={yLegend ?? 'price'}
            type={'number'}
            domain={['dataMin', 'dataMax']}
            orientation="left"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '10px' }}
          />
          <Tooltip
            content={({ payload, label, active }) => {
              if (active && payload) {
                const value = payload[0]?.value as string
                const customContent = (
                  <Card>
                    <div>
                      <div>{` ${label}`}</div>
                      <div>{`${
                        yLegend ?? payload[0].dataKey
                      } : ${thousandSeparator(Number(value))}`}</div>
                    </div>
                  </Card>
                )
                return customContent
              }
              return null
            }}
          />
          <defs>
            <linearGradient id={`custom-colorBCA`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor={'#00B8D9'} stopOpacity={0.9}></stop>
              <stop
                offset="80%"
                stopColor={'#00B8D9'}
                stopOpacity={0.05}
              ></stop>
            </linearGradient>
            <linearGradient id={`custom-colorBNI`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor={'#FFAB00'} stopOpacity={0.9}></stop>
              <stop offset="80%" stopColor={'white'} stopOpacity={0.05}></stop>
            </linearGradient>
            <linearGradient
              id={`custom-colorMandiri`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="20%" stopColor={'#007DFE'} stopOpacity={0.9}></stop>
              <stop
                offset="80%"
                stopColor={'#007DFE'}
                stopOpacity={0.05}
              ></stop>
            </linearGradient>
          </defs>
          <Area
            type="natural"
            dataKey={'bca'}
            fill={`url(#custom-colorBCA)`}
            stroke={'#00B8D9'}
            strokeWidth={2.5}
          />
          <Area
            type="natural"
            dataKey={'bni'}
            fill={`url(#custom-colorBNI)`}
            stroke={'#FFAB00'}
            strokeWidth={2.5}
          />
          <Area
            type="natural"
            dataKey={'mandiri'}
            fill={`url(#custom-colorMandiri)`}
            stroke={'#007DFE'}
            strokeWidth={2.5}
          />
          <Legend wrapperStyle={{ fontSize: '12px', marginBottom: '0.5rem' }} />
          {/* <ReferenceLine
            y={referenceLinePoint}
            // stroke={colorToken.grayNusantara}
            strokeWidth={1}
            strokeDasharray={'4'}
          /> */}
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaChart
