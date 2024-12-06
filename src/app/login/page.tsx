import { cookies } from 'next/headers'
import Login from './Login'
import { cookiesOptions } from './constants'

const baseUrl = process.env.BASE_URL

async function handleSetSession(token: string, email: string, role: string) {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('ACCESS_TOKEN', token, { ...cookiesOptions })
  cookiesStore.set('USER', email, { ...cookiesOptions })
  cookiesStore.set('ROLE', role, { ...cookiesOptions })
}

const LoginPage = () => {
  return <Login handleSetSession={handleSetSession} baseUrl={baseUrl} />
}

export default LoginPage
