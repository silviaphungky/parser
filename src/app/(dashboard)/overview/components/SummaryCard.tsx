import { Card } from '@/components'
import { ReactNode } from 'react'

interface Props {
  title: string
  icon: ReactNode
  description: string
}

const SummaryCard = ({ title, icon, description }: Props) => {
  return (
    <Card className="w-[15rem]">
      <div className="flex items-center gap-6">
        {icon}
        <div>
          <h2 className="mt-2 text-sm">{title}</h2>
          <p className="mt-1 text-lg font-bold">{description}</p>
        </div>
      </div>
    </Card>
  )
}

export default SummaryCard
