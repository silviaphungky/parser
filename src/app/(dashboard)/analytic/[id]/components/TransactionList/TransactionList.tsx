import { Card } from '@/components'
import { TransactionTable } from './components'

const mockTransactionList = []

const TransactionList = () => {
  return (
    <div>
      <Card>
        <TransactionTable />
      </Card>
    </div>
  )
}

export default TransactionList
