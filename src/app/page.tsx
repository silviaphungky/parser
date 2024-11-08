import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  } else {
    redirect('/penyelenggara-negara')
  }
}
