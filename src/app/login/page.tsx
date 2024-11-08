import { cookies } from 'next/headers'
import Login from './Login'
import { cookiesOptions } from './constants'

async function handleSetSession(token: string) {
  'use server'
  cookies().set('ACCESS_TOKEN', token, { ...cookiesOptions })
}

const LoginPage = () => {
  return <Login handleSetSession={handleSetSession} />
}

export default LoginPage
