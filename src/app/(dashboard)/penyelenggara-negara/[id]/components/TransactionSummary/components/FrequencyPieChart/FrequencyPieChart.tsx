'use client'
import { Card, PieChart, Shimmer } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { numberAbbv } from '@/utils/numberAbbv'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
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
  'rgba(23, 190, 207, 0.8)',
  'rgb(210, 105, 30, 0.6)',
  'rgb(138, 43, 226, 0.6)',
  'rgb(222, 49, 99, 0.6)',
  'rgb(106, 90, 205, 0.6)',
  'rgb(255, 99, 71, 0.6)',
  'rgba(44, 160, 44, 0.8)',
  'rgba(214, 39, 40, 0.8)',
  'rgba(148, 103, 189, 0.8)',
  'rgba(140, 86, 75, 0.8)',
  'rgba(127, 127, 127, 0.8)',
  'rgba(188, 189, 34, 0.8)',
  'rgba(255, 187, 120, 0.8)',
]

const mockFreqFilter = [
  {
    id: 'CATEGORY',
    label: 'Kategori',
  },
  {
    id: 'TRANSACTION_METHOD',
    label: 'Metode Transaksi',
  },
]

const mockBasedOn = [
  {
    id: 'freq',
    label: 'Frekuensi Transaksi',
  },
  {
    id: 'value',
    label: 'Nominal Transaksi',
  },
]

const FrequencyPieChart = ({
  selectedCurrency,
  selectedDate,
  token,
}: {
  selectedCurrency: {
    id: string | number
    label: string
  }
  selectedDate: {
    from: Date | undefined
    to: Date | undefined
  }
  token: string
}) => {
  const { id } = useParams()
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string | number
    label: string
  }>(mockFreqFilter[0])
  const [selectedBased, setSelectedBased] = useState<{
    id: string | number
    label: string
  }>(mockBasedOn[0])

  const handleChangeSelectedGroup = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedGroup(option)
  }

  const handleChangeBased = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedBased(option)
  }

  const {
    data: pieChartDataIn,
    isLoading,
    isFetching,
  } = useQuery<{
    summary_pie_chart: Array<{
      name: string
      value: number
      frequency: number
    }>
  }>({
    queryKey: [
      'pieChartDataIn',
      selectedDate.from,
      selectedDate.to,
      selectedCurrency.id,
      selectedGroup.id,
      id,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TOP_TRANSACTION}/${id}/summary/pie-chart`,
        {
          params: {
            start_period: selectedDate.from
              ? dayjs(selectedDate.from).format('YYYY-MM-DD')
              : undefined,
            end_period: selectedDate.to
              ? dayjs(selectedDate.to).format('YYYY-MM-DD')
              : undefined,
            currency: selectedCurrency.id,
            direction: 'IN',
            group_by: selectedGroup.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const {
    data: pieChartDataOut,
    isLoading: isLoadingOut,
    isFetching: isFetcingOut,
  } = useQuery<{
    summary_pie_chart: Array<{
      name: string
      value: number
      frequency: number
    }>
  }>({
    queryKey: [
      'pieChartDataOut',
      selectedDate.from,
      selectedDate.to,
      selectedCurrency.id,
      selectedGroup.id,
      id,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TOP_TRANSACTION}/${id}/summary/pie-chart`,
        {
          params: {
            start_period: selectedDate.from
              ? dayjs(selectedDate.from).format('YYYY-MM-DD')
              : undefined,
            end_period: selectedDate.to
              ? dayjs(selectedDate.to).format('YYYY-MM-DD')
              : undefined,
            currency: selectedCurrency.id,
            direction: 'OUT',
            group_by: selectedGroup.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex gap-4 mb-4">
      <Card className="flex-1">
        <div className="flex mb-6 justify-end items-center gap-4">
          <div className="text-sm">Pengelompokan berdasarkan:</div>
          <div className="w-[12rem] ">
            <InputDropdown
              value={selectedGroup}
              options={mockFreqFilter}
              onChange={handleChangeSelectedGroup}
            />
          </div>
          <div className="w-[12rem]">
            <InputDropdown
              options={mockBasedOn}
              value={selectedBased}
              onChange={handleChangeBased}
            />
          </div>
        </div>

        <div className="flex-1 flex gap-6">
          <div className="flex-1 border border-gray-300 py-2 rounded">
            <div className="text-xl font-semibold text-center">
              Transfer Masuk
            </div>
            <div>
              {isLoading ? (
                <Shimmer />
              ) : (
                <PieChart
                  chartData={
                    pieChartDataIn?.summary_pie_chart?.sort((a, b) =>
                      selectedBased.id === 'freq'
                        ? b.frequency - a.frequency
                        : b.value - a.value
                    ) || []
                  }
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
                          pieChartDataIn?.summary_pie_chart
                            ?.map((item) =>
                              selectedBased.id === 'freq'
                                ? item.frequency
                                : item.value
                            )
                            .reduce((acc, current) => {
                              return acc + current
                            }) || 0
                        )}
                      </text>
                    </>
                  )}
                />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-2">
              <div className="flex-1 border border-gray-300 py-2 rounded">
                <div className="text-xl font-semibold text-center">
                  Transfer Keluar
                </div>

                <div>
                  {isLoadingOut ? (
                    <Shimmer />
                  ) : (
                    <PieChart
                      chartData={
                        pieChartDataOut?.summary_pie_chart?.sort((a, b) =>
                          selectedBased.id === 'freq'
                            ? b.frequency - a.frequency
                            : b.value - a.value
                        ) || []
                      }
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
                              pieChartDataOut?.summary_pie_chart
                                ?.map((item) =>
                                  selectedBased.id === 'freq'
                                    ? item.frequency
                                    : item.value
                                )
                                .reduce((acc, current) => {
                                  return acc + current
                                }) || 0
                            )}
                          </text>
                        </>
                      )}
                    />
                  )}
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
