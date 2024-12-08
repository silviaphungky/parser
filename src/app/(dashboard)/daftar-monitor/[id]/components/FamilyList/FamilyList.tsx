'use client'
import { Card } from '@/components'
import { FamilyTable } from './components'

const FamilyList = ({ token, baseUrl }: { token: string; baseUrl: string }) => {
  return (
    <div>
      <Card className="mb-8">
        <FamilyTable token={token} baseUrl={baseUrl} />
      </Card>
    </div>
  )
}

export default FamilyList
