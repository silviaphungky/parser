import { Card, Title } from '@/components'
import PNTable from './components/PNTable'
import { IconPlus } from '@/icons'

const PNPage = () => {
  return (
    <div>
      <div className="flex justify-between">
        <Title title="PN" />
        <button className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95">
          <IconPlus color="#fff" size={18} />
          New PN
        </button>
      </div>
      <Card className="w-full mt-6">
        <PNTable />
      </Card>
    </div>
  )
}

export default PNPage
