'use client'
import Link from 'next/link'

import { SIDEBAR_MENU } from './constant'
import { usePathname, useRouter } from 'next/navigation'
import { IconLogout, Logo } from '@/icons'

const Sidebar = () => {
  const pathname = usePathname()
  const MENU = SIDEBAR_MENU

  const router = useRouter()

  const logout = () => {
    router.push('/login')
  }

  return (
    <div className="fixed left-0 border-r border-gray-200 pt-5 px-2 h-screen">
      <div className="flex items-center justify-center mb-10">
        <Logo width={180} height={35} />
      </div>
      {MENU.map((item, index) => {
        const isSelected = pathname.includes(item.link)
        return (
          <div key={item.key}>
            <Link
              href={item.link}
              key={`menu-${item.key}-${index}}`}
              className={`flex py-2 my-2 pr-1 pl-6 text-gray-500 
                w-56 justify-between items-center cursor-pointer
              ${isSelected && 'bg-[#FFE7E7] rounded-md'}
                `}
            >
              <div className="flex gap-3 items-center">
                {item.icon(isSelected)}
                <div
                  className={`${
                    isSelected ? 'text-primary' : 'text-dark'
                  } text-sm font-semibold `}
                >
                  {item.name}
                </div>
              </div>
            </Link>
          </div>
        )
      })}

      <div
        className={`absolute bottom-10 flex py-2 my-2 pr-1 pl-6 text-gray-500 w-56 gap-3 items-center cursor-pointer`}
        onClick={logout}
      >
        <IconLogout />
        <div className="text-sm text-dark">Keluar</div>
      </div>
    </div>
  )
}

export default Sidebar
