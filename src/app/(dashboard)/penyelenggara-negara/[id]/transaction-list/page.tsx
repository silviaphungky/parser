import { cookies } from 'next/headers'
import TransactionList from '../components/TransactionList'
import { redirect } from 'next/navigation'

const TransactionListPage = async () => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return <TransactionList token={token} />
}

export default TransactionListPage
