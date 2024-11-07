import { cookies } from 'next/headers'
import Login from './Login'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const cookiesOptions: Partial<ResponseCookie> = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
}

async function handleSetSession(token: string) {
  'use server'
  console.log({ token })
  cookies().set('ACCESS_TOKEN', token, { ...cookiesOptions })
}

const LoginPage = () => {
  return <Login handleSetSession={handleSetSession} />
}

export default LoginPage
