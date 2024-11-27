import { cookies } from 'next/headers'
import Login from './Login'
import { cookiesOptions } from './constants'

async function handleSetSession(token: string, email: string) {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('ACCESS_TOKEN', token, { ...cookiesOptions })
  cookiesStore.set('USER', email, { ...cookiesOptions })
}

const LoginPage = () => {
  return <Login handleSetSession={handleSetSession} />
}

export default LoginPage
