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
    entity_name,
    entity_account_number,
    entity_bank,
    currency,
  }: {
    transaction_id: string
    entity_name: string
    entity_account_number: string
    entity_bank: string
    currency: string
  }) => {
    'use server'
    try {
      const response = await fetch(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/entity/verify`,
        {
          body: JSON.stringify({
            transaction_id,
            entity_name,
            entity_account_number,
            entity_bank,
            currency,
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        )
      }

      const data = await response.json()

      return {
        isSuccess: data.status === 200,
        error: '',
        data: data.data,
      }
    } catch (error: any) {
      console.error(`Error verifying bank account: ${error.message}`)
      return {
        isSuccess: false,
        error: error.message || 'An unknown error occurred',
        data: null,
      }
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
