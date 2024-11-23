import { redirect } from 'next/navigation'
import { TransactionSummary } from '../components'
import { cookies } from 'next/headers'

const TransactionSummaryPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }
  return <TransactionSummary token={token} />
}

export default TransactionSummaryPage
