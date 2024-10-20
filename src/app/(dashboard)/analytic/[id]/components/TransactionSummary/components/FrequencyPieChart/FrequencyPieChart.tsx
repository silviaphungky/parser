import { Card, PieChart } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { numberAbbv } from '@/utils/numberAbbv'
import { useState } from 'react'

const pieChartColorMap = [
  'rgb(112, 219, 255, 0.6)',
  'rgb(51, 87, 255, 0.6)',
  'rgb(255, 51, 161, 0.6)',
  'rgb(255, 195, 0, 0.6)',
  'rgb(255, 87, 51, 0.6)',
  'rgb(218, 247, 166, 0.6)',
  'rgb(88, 24, 69, 0.6)',
  'rgb(199, 0, 57, 0.6)',
  'rgb(255, 141, 26, 0.6)',
  'rgb(223, 255, 0, 0.6)',
  'rgb(255, 87, 51, 0.6)',
  'rgb(64, 224, 208, 0.6)',
  'rgb(51, 255, 87, 0.6)',
  'rgb(144, 12, 63, 0.6)',
  'rgb(100, 149, 237, 0.6)',
  'rgb(210, 105, 30, 0.6)',
  'rgb(138, 43, 226, 0.6)',
  'rgb(222, 49, 99, 0.6)',
  'rgb(106, 90, 205, 0.6)',
  'rgb(255, 99, 71, 0.6)',
]

const mockFreqFilter = [
  {
    id: 'category',
    label: 'Category',
  },
  {
    id: 'transactionMethod',
    label: 'Transaction Method',
  },
]

const FrequencyPieChart = ({
  data,
}: {
  data: {
    category: {
      in: Array<{ name: string; value: number }>
      out: Array<{ name: string; value: number }>
    }
    transactionMethod: {
      in: Array<{ name: string; value: number }>
      out: Array<{ name: string; value: number }>
    }
  }
}) => {
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string | number
    label: string
  }>(mockFreqFilter[0])

  const handleChangeSelectedGroup = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedGroup(option)
  }
  return (
    <div className="flex gap-4 mb-4">
      <Card className="flex-1">
        <div className="flex mb-6 justify-end items-center gap-4">
          <div className="text-sm">Group by:</div>
          <div className="w-[12rem] ">
            <InputDropdown
              value={selectedGroup}
              options={mockFreqFilter}
              onChange={handleChangeSelectedGroup}
            />
          </div>
        </div>

        <div className="flex-1 flex gap-6">
          <div className="flex-1 border border-gray-300 py-2 rounded">
            <div className="text-xl font-semibold text-center">Transfer In</div>
            <div>
              <PieChart
                chartData={data[
                  selectedGroup.id as 'category' | 'transactionMethod'
                ].in.sort((a, b) => b.value - a.value)}
                value={50}
                size={350}
                colorMap={pieChartColorMap}
                label={(props: any) => (
                  <>
                    <text
                      className="text-sm"
                      x={props.cx}
                      y={props.cy - 16}
                      textAnchor="middle"
                    >
                      {selectedGroup.label}
                    </text>
                    <text
                      className="font-semibold"
                      x={props.cx}
                      y={props.cy + 16}
                      textAnchor="middle"
                    >
                      {numberAbbv(
                        data[
                          selectedGroup.id as 'category' | 'transactionMethod'
                        ].in
                          .map((item) => item.value)
                          .reduce((acc, current) => {
                            return acc + current
                          })
                      )}
                    </text>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-2">
              <div className="flex-1 border border-gray-300 py-2 rounded">
                <div className="text-xl font-semibold text-center">
                  Transfer Out
                </div>

                <div>
                  <PieChart
                    chartData={data[
                      selectedGroup.id as 'category' | 'transactionMethod'
                    ].out.sort((a, b) => b.value - a.value)}
                    value={50}
                    size={350}
                    colorMap={pieChartColorMap}
                    label={(props: any) => (
                      <>
                        <text
                          className="text-sm"
                          x={props.cx}
                          y={props.cy - 16}
                          textAnchor="middle"
                        >
                          {selectedGroup.label}
                        </text>
                        <text
                          className="font-semibold"
                          x={props.cx}
                          y={props.cy + 16}
                          textAnchor="middle"
                        >
                          {numberAbbv(
                            data[
                              selectedGroup.id as
                                | 'category'
                                | 'transactionMethod'
                            ].out
                              .map((item) => item.value)
                              .reduce((acc, current) => {
                                return acc + current
                              })
                          )}
                        </text>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FrequencyPieChart
