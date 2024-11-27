'use client'
import { Card, Shimmer } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ContributionCalendar } from 'react-contribution-calendar'
import { mockTransactionMethod } from '../TreemapSubjectFreqValue/TreemapSubjectFreqValue'
import ReactSelect, { MultiValue } from 'react-select'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useParams } from 'next/navigation'

const mockTransactionType = [
  {
    id: '',
    label: 'Transaksi Masuk/Keluar',
  },
  {
    id: 'IN',
    label: 'Transaksi Masuk',
  },
  {
    id: 'OUT',
    label: 'Transaksi Keluar',
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

const yearList = [
  dayjs(new Date()).format('YYYY'),
  dayjs(new Date()).subtract(1, 'y').format('YYYY'),
  dayjs(new Date()).subtract(2, 'y').format('YYYY'),
  dayjs(new Date()).subtract(3, 'y').format('YYYY'),
  dayjs(new Date()).subtract(4, 'y').format('YYYY'),
  dayjs(new Date()).subtract(5, 'y').format('YYYY'),
  dayjs(new Date()).subtract(6, 'y').format('YYYY'),
  dayjs(new Date()).subtract(7, 'y').format('YYYY'),
]

const color = {
  IN: [
    'rgb(168, 230, 207, 0.8)',
    'rgb(112, 193, 179, 0.8)',
    'rgb(46, 133, 110, 0.8)',
    'rgb(19, 68, 52, 0.8)',
  ],
  OUT: [
    'rgba(255, 204, 204, 0.8)',
    'rgba(255, 102, 102, 0.8)',
    'rgba(255, 51, 51, 0.8)',
    'rgba(153, 31, 31, 0.8)',
  ],
  '': [
    'rgba(173, 216, 230, 0.8)',
    'rgb(113, 154, 231, 0.8)',
    'rgba(30, 144, 255, 0.8)',
    'rgba(0, 0, 205, 0.8)',
  ],
}

const FreqValueHeatmapDate = ({
  selectedCurrency,
  token,
}: {
  selectedCurrency: {
    id: string | number
    label: string
  }

  token: string
}) => {
  const { id } = useParams()
  const [selectedYear, setSelectedYear] = useState(yearList[0])
  const [selectedType, setSelectedType] = useState<{
    id: string | number
    label: string
  }>(mockTransactionType[0])
  const [selectedBased, setSelectedBased] = useState<{
    id: string | number
    label: string
  }>(mockBasedOn[0])
  const [selectedTransactionMethod, setSelectedTransactionMethod] = useState<
    MultiValue<{ value: string; label: string }>
  >([])

  const handleChangeType = (option: { id: string | number; label: string }) => {
    setSelectedType(option)
  }

  const handleChangeBased = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedBased(option)
  }

  const handleChangeYear = (year: string) => {
    setSelectedYear(year)
  }

  const transactionMethodPayload = selectedTransactionMethod.map((item) => {
    return item.value
  })

  const {
    data: heatmapData = { summary_calendar: [] },
    isLoading,
    isFetching,
  } = useQuery<{
    summary_calendar: Array<{
      [key: string]: {
        frequency: number
        value: number
      }
    }>
  }>({
    queryKey: [
      'heatmapData',
      selectedYear,
      selectedCurrency.id,
      selectedType.id,
      transactionMethodPayload,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL.TOP_TRANSACTION}/${id}/summary/calendar`,
        {
          params: {
            year: selectedYear,
            currency: selectedCurrency.id,
            direction: selectedType.id,
            transaction_method: transactionMethodPayload,
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

  const formattedData = heatmapData.summary_calendar.map((item) => {
    const key = Object.keys(item)[0]
    let levelFreq = 0
    let levelVal = 0

    if (item[key].frequency > 10) levelFreq = 4
    else if (item[key].frequency > 7 && item[key].frequency <= 10) levelFreq = 3
    else if (item[key].frequency > 4 && item[key].frequency <= 7) levelFreq = 2
    else if (item[key].frequency > 0 && item[key].frequency <= 4) levelFreq = 1
    else levelFreq = 0

    if (item[key].value > 20000000) levelVal = 4
    else if (item[key].value > 10000000 && item[key].value <= 20000000)
      levelVal = 3
    else if (item[key].value > 2000000 && item[key].value <= 10000000)
      levelVal = 2
    else if (item[key].value > 0 && item[key].value <= 2000000) levelVal = 1
    else levelVal = 0

    return {
      [key]: {
        data: item[key],
        level: selectedBased.id === 'freq' ? levelFreq : levelVal,
      },
    }
  })

  return (
    <Card className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm">
          Pengelompokan berdasarkan{' '}
          <strong className="font-semibold"> Waktu</strong>
        </div>

        <div className="flex gap-2">
          <div className="w-[14rem]">
            <InputDropdown
              options={mockTransactionType}
              value={selectedType}
              onChange={handleChangeType}
            />
          </div>
          <div className="w-[20rem]">
            <ReactSelect
              isMulti
              value={selectedTransactionMethod}
              onChange={(props) => setSelectedTransactionMethod(props)}
              name="colors"
              options={mockTransactionMethod}
              className="react-select-container"
              placeholder="Pilih metode transaksi"
              styles={{
                option: (styles, state) => ({
                  ...styles,
                  backgroundColor: state.isSelected ? '#E6EFF5' : '',
                  '&:hover': {
                    // overriding hover
                    ...styles, // apply initial styles
                    backgroundColor: '#E6EFF5',
                  },
                }),
                indicatorsContainer: (base, props) => {
                  return {
                    ...base,
                    alignItems: 'start',
                  }
                },
                clearIndicator: (base) => {
                  return {
                    ...base,
                    cursor: 'pointer',
                  }
                },
                dropdownIndicator: (base) => {
                  return {
                    ...base,
                    cursor: 'pointer',
                  }
                },
                control: (baseStyles, state) => {
                  return {
                    ...baseStyles,
                    borderColor: 'rgb(209, 213, 219)',
                    boxShadow: 'none',
                    borderRadius: '0.375rem',
                    height: '34px',
                    overflow: 'auto',
                  }
                },
              }}
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
      </div>
      {isLoading && <Shimmer />}
      <div className="contributionCalendar__Container flex justify-between">
        {!isLoading && (
          <ContributionCalendar
            data={formattedData}
            start={
              selectedYear
                ? dayjs(new Date(`${selectedYear}/1/1`)).format('YYYY-MM-DD')
                : `${dayjs(new Date())
                    .subtract(1, 'year')
                    .format('YYYY-MM-DD')}`
            }
            end={
              selectedYear
                ? dayjs(new Date(`${selectedYear}/12/31`)).format('YYYY-MM-DD')
                : `${dayjs(new Date()).format('YYYY-MM-DD')}`
            }
            daysOfTheWeek={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            textColor="#1F2328"
            startsOnSunday={true}
            includeBoundary={true}
            style={{
              borderCollapse: 'unset !important',
            }}
            theme={{
              level0: '#E6EFF5',
              level1: color[selectedType.id as 'IN' | 'OUT'][0],
              level2: color[selectedType.id as 'IN' | 'OUT'][1],
              level3: color[selectedType.id as 'IN' | 'OUT'][2],
              level4: color[selectedType.id as 'IN' | 'OUT'][3],
            }}
            cr={2}
            onCellClick={(e, data) => console.log({ data })}
            scroll={false}
          />
        )}
      </div>
      <div>
        <div className="overflow-auto pr-6 flex gap-2">
          {[...yearList].map((item, index) => (
            <div
              key={index}
              className={`text-sm py-1 cursor-pointer ${
                selectedYear === item && 'font-extrabold'
              }`}
              onClick={() => handleChangeYear(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default FreqValueHeatmapDate
