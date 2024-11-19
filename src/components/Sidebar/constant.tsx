import { IconFileCheck, IconReceipt, IconUsers } from '@/icons'
import IconChart from '@/icons/IconChart'
import IconNotif from '@/icons/IconNotif'
import IconSetting from '@/icons/IconSetting'

export const SIDEBAR_MENU = [
  {
    key: 'pn',
    name: 'Penyelenggara Negara',
    link: '/penyelenggara-negara',
    icon: (isSelected: boolean) => (
      <IconUsers color={isSelected ? '#EA454C' : undefined} />
    ),
  },
  {
    key: 'overview',
    name: 'Ringkasan',
    link: '/overview',
    icon: (isSelected: boolean) => (
      <IconFileCheck color={isSelected ? '#EA454C' : undefined} />
    ),
  },
  {
    key: 'notif',
    name: 'Pemberitahuan',
    link: '/pemberitahuan',
    icon: (isSelected: boolean) => (
      <IconNotif color={isSelected ? '#EA454C' : undefined} />
    ),
  },
  {
    key: 'user',
    name: 'Manajemen Pengguna',
    link: '/user-management',
    icon: (isSelected: boolean) => (
      <IconSetting color={isSelected ? '#EA454C' : undefined} />
    ),
  },
]
