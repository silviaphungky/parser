import { cookies } from 'next/headers'
import TransactionStatementList from '../components/TransactionStatements/TransactionStatementList'
import { redirect } from 'next/navigation'

const TransactionStatementsPage = async () => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return <TransactionStatementList token={token} />
}

export default TransactionStatementsPage
