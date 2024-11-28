'use client'
import { Card } from '@/components'
import { FamilyTable } from './components'

const FamilyList = ({ token }: { token: string }) => {
  return (
    <div>
      <Card className="mb-8">
        <FamilyTable token={token} />
      </Card>
    </div>
  )
}

export default FamilyList
