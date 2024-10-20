'use client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ContributionCalendar } from 'react-contribution-calendar'

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

const TransactionHeatmapDate = ({
  data,
  color,
}: {
  data: InputData[]
  color: Array<string>
}) => {
  const [selectedYear, setSelectedYear] = useState(yearList[0])
  const handleChangeYear = (year: string) => {
    setSelectedYear(year)
  }

  return (
    <div className="contributionCalendar__Container flex">
      <ContributionCalendar
        data={data}
        start={`${dayjs(new Date()).subtract(1, 'year').format('YYYY-MM-DD')}`}
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
          level1: color[0],
          level2: color[1],
          level3: color[2],
          level4: color[3],
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
  )
}

export default TransactionHeatmapDate
