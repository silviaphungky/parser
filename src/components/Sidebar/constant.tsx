import { IconFileCheck, IconReceipt, IconUsers } from '@/icons'
import IconChart from '@/icons/IconChart'
import IconSetting from '@/icons/IconSetting'

export const SIDEBAR_MENU = [
  {
    key: 'overview',
    name: 'Overview',
    link: '/overview',
    icon: (isSelected: boolean) => (
      <IconFileCheck color={isSelected ? '#EA454C' : undefined} />
    ),
  },
  {
    key: 'pn',
    name: 'Wajib Lapor',
    link: '/wajib-lapor',
    icon: (isSelected: boolean) => (
      <IconUsers color={isSelected ? '#EA454C' : undefined} />
    ),
  },
  {
    key: 'analytic',
    name: 'Analytic',
    link: '/analytic',
    icon: (isSelected: boolean) => (
      <IconChart color={isSelected ? '#EA454C' : undefined} />
    ),
  },
  {
    key: 'user',
    name: 'User Management',
    link: '/user-management',
    icon: (isSelected: boolean) => (
      <IconSetting color={isSelected ? '#EA454C' : undefined} />
    ),
  },
]
