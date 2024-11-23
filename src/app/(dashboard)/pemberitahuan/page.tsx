import { Title } from '@/components'
import { NotificationList } from './components'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const NotificationPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    redirect('/login')
  }

  return (
    <div>
      <Title title="Pemberitahuan" />
      <NotificationList token={token} />
    </div>
  )
}

export default NotificationPage
