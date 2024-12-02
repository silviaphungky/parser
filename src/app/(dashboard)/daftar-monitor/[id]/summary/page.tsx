import { redirect } from 'next/navigation'
import { TransactionSummary } from '../components'
import { cookies } from 'next/headers'
import { clearCookies } from '@/app/(dashboard)/layout'

const TransactionSummaryPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }
  return <TransactionSummary token={token} />
}

export default TransactionSummaryPage
