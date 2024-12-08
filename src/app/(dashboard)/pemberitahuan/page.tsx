import { Title } from '@/components'
import { NotificationList } from './components'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { clearCookies } from '../layout'

const baseUrl = process.env.BASE_URL || ''

const NotificationPage = () => {
  const token = cookies().get('ACCESS_TOKEN')?.value || ''

  if (!token) {
    clearCookies()
    redirect('/login')
  }

  return (
    <div>
      <Title title="Pemberitahuan" />
      <div className="text-sm">
        Menampilkan semua aktivitas yang dilakukan oleh admin lain terhadap
        daftar PN yang Anda kelola. Aktivitas tersebut mencakup penambahan
        daftar pantauan, pengunduhan daftar transaksi, pengunggahan laporan
        bank, perubahan catatan, pembaruan informasi lawan transaksi, pengubahan
        kategori, penandaan atau penghapusan tanda pada transaksi, serta
        penambahan atau penghapusan relasi keluarga.
      </div>
      <NotificationList token={token} baseUrl={baseUrl} />
    </div>
  )
}

export default NotificationPage
