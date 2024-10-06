import { Title } from '@/components'
import SummaryCard from './components/SummaryCard'
import { IconReceipt, IconUsers } from '@/icons'
import { thousandSeparator } from '@/utils/thousanSeparator'
import { ReactNode } from 'react'

const SUMMARY = [
  {
    key: 'pn',
    value: 2000,
  },
  {
    key: 'mutation',
    value: 8888,
  },
]

const IconMap: { [key in 'pn' | 'mutation']: ReactNode } = {
  pn: (
    <div className="bg-[#FFE0EB] rounded-full p-4">
      <IconUsers color="#FF82AC" />
    </div>
  ),
  mutation: (
    <div className="bg-[#FFF5D9] rounded-full p-4">
      <IconReceipt color="#FFBB38" />
    </div>
  ),
}

const TitleMap: { [key in 'pn' | 'mutation']: string } = {
  pn: 'PN',
  mutation: 'Bank Statement',
}

const OverviewPage = () => {
  return (
    <div>
      <Title title="Overview" />
      <div className="flex gap-4 flex-1 mt-6">
        {SUMMARY.map((item) => (
          <SummaryCard
            key={item.key}
            icon={IconMap[item.key as 'pn' | 'mutation']}
            title={TitleMap[item.key as 'pn' | 'mutation']}
            description={thousandSeparator(item.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default OverviewPage
