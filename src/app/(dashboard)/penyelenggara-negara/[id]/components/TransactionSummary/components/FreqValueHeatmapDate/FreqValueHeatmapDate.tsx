'use client'
import { Card } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ContributionCalendar } from 'react-contribution-calendar'

const mockTransactionType = [
  {
    id: 'in',
    label: 'Transaksi Masuk',
  },
  {
    id: 'out',
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
  in: [
    'rgb(168, 230, 207, 0.8)',
    'rgb(112, 193, 179, 0.8)',
    'rgb(46, 133, 110, 0.8)',
    'rgb(19, 68, 52, 0.8)',
  ],
  out: [
    'rgba(255, 204, 204, 0.8)',
    'rgba(255, 102, 102, 0.8)',
    'rgba(255, 51, 51, 0.8)',
    'rgba(153, 31, 31, 0.8)',
  ],
}

const FreqValueHeatmapDate = ({
  data,
}: {
  data: {
    in: InputData[]
    out: InputData[]
  }
}) => {
  const [selectedYear, setSelectedYear] = useState(yearList[0])
  const [selectedType, setSelectedType] = useState<{
    id: string | number
    label: string
  }>(mockTransactionType[0])
  const [selectedBased, setSelectedBased] = useState<{
    id: string | number
    label: string
  }>(mockBasedOn[0])

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

  return (
    <Card className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm">Pengelompokan berdasarkan Waktu</div>

        <div className="flex gap-2">
          <div className="w-[10rem]">
            <InputDropdown
              options={mockTransactionType}
              value={selectedType}
              onChange={handleChangeType}
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
      <div className="contributionCalendar__Container flex">
        <ContributionCalendar
          data={data[selectedType.id as 'in' | 'out']}
          start={`${dayjs(new Date())
            .subtract(1, 'year')
            .format('YYYY-MM-DD')}`}
          end={`${dayjs(new Date()).format('YYYY-MM-DD')}`}
          daysOfTheWeek={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          textColor="#1F2328"
          startsOnSunday={true}
          includeBoundary={true}
          style={{
            borderCollapse: 'unset !important',
          }}
          theme={{
            level0: '#E6EFF5',
            level1: color[selectedType.id as 'in' | 'out'][0],
            level2: color[selectedType.id as 'in' | 'out'][1],
            level3: color[selectedType.id as 'in' | 'out'][2],
            level4: color[selectedType.id as 'in' | 'out'][3],
          }}
          cr={2}
          onCellClick={(e, data) => console.log(data)}
          scroll={false}
        />
        <div>
          <div className="overflow-auto h-[10rem]">
            {yearList.map((item, index) => (
              <div
                key={index}
                className={`text-sm py-1 cursor-pointer ${
                  selectedYear === item && 'font-bold'
                }`}
                onClick={() => handleChangeYear(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default FreqValueHeatmapDate
