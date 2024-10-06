import { IconFileCheck, IconReceipt, IconUsers } from '@/icons'
import IconChart from '@/icons/IconChart'

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
    name: 'PN',
    link: '/pn',
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
    key: 'mutation',
    name: 'Mutation',
    link: '/mutation',
    icon: (isSelected: boolean) => (
      <IconReceipt color={isSelected ? '#EA454C' : undefined} />
    ),
  },
]
