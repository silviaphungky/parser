import { cookies } from 'next/headers'
import TransactionList from '../components/TransactionList'
import { redirect } from 'next/navigation'
import { clearCookies } from '@/app/(dashboard)/layout'
import { API_URL } from '@/constants/apiUrl'

const baseUrl = process.env.BASE_URL || ''

const TransactionListPage = async () => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  const verifyBankAccount = async ({
    transaction_id,
  }: {
    transaction_id: string
  }) => {
    'use server'
    const response = await fetch(
      `https://499e2567-eab8-4cda-bdb4-d2dd8fb584b8-00-2ns1p7d6pfgj6.pike.replit.dev/${API_URL.UPDATE_TRANSACTION}/${transaction_id}/entity/verify`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await response.json()

    return {
      isSuccess: data.status === 200,
      error: data.message || '',
      data: data.data,
    }
  }

  return (
    <TransactionList
      token={token}
      verifyBankAccount={verifyBankAccount}
      baseUrl={baseUrl}
    />
  )
}

export default TransactionListPage
