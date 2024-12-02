import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { clearCookies } from './(dashboard)/layout'

export default function Home() {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  } else {
    redirect('/daftar-monitor')
  }
}
