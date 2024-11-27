import { cookies } from 'next/headers'
import TransactionStatementList from '../components/TransactionStatements/TransactionStatementList'
import { redirect } from 'next/navigation'
import { clearCookies } from '@/app/(dashboard)/layout'

const TransactionStatementsPage = async () => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return <TransactionStatementList token={token} />
}

export default TransactionStatementsPage
