'use client'
import Link from 'next/link'
import { SIDEBAR_MENU } from './constant'
import { usePathname, useRouter } from 'next/navigation'
import { IconChevronDown, IconLogout, Logo } from '@/icons'
import { ReactNode, useState } from 'react'
import { colorToken } from '@/constants/color-token'

const Sidebar = ({
  role,
  email,
  children,
  clearCookies,
}: {
  role: 'SUPER_ADMIN' | 'ADMIN'
  email: string
  children: ReactNode
  clearCookies: () => void
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  const logout = () => {
    router.push('/login')
    clearCookies()
  }

  return (
    <>
      <div
        className={`fixed left-0 border-r border-gray-200 pt-5 px-2 h-screen transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-center mb-8">
          {isCollapsed ? (
            <div>
              <img src="/logo-kpk.png" alt="logo" width={60} />
              <div className="font-semibold text-base text-center">Parser</div>
            </div>
          ) : (
            <div className="flex gap-0 items-center">
              <img src="/logo-kpk.png" width={125} alt="logo" />
              <div className="font-semibold text-lg ">Parser</div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        {SIDEBAR_MENU.map((item, index) => {
          const isSelected = pathname.includes(item.link)
          if (role === 'ADMIN' && item.key === 'user') return null
          return (
            <div key={item.key}>
              <Link
                href={item.link}
                className={`flex items-center py-2 my-2 pr-1 ${
                  isCollapsed ? 'pl-2' : 'pl-6'
                } text-gray-500 w-full cursor-pointer
                ${isSelected && 'bg-[#FFE7E7] rounded-md'}
              `}
              >
                <div className="flex gap-3 items-center">
                  {item.icon(isSelected)}
                  {!isCollapsed && (
                    <span
                      className={`${
                        isSelected ? 'text-primary' : 'text-dark'
                      } text-sm font-semibold`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )
        })}

        <div className="flex">
          {/* Logout Button */}
          <div
            className={`absolute bottom-10 flex items-center py-2 my-2 pr-1 ${
              isCollapsed ? 'pl-2' : 'pl-6'
            } text-gray-500 w-full gap-3 cursor-pointer`}
            onClick={logout}
          >
            <IconLogout color={'#3B4752'} size={18} />
            {!isCollapsed && <span className="text-sm text-dark">Keluar</span>}
          </div>
          {/* Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="absolute bottom-11 -right-5 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isCollapsed ? (
              <div className="cursor-pointer -rotate-90 bg-white rounded-full p-2 border-gray-300 border shadow-sm">
                <IconChevronDown size={20} color={colorToken.grayVulkanik} />
              </div>
            ) : (
              <div className="cursor-pointer rotate-90 bg-white rounded-full p-2 border-gray-300 border shadow-sm">
                <IconChevronDown size={20} color={colorToken.grayVulkanik} />
              </div>
            )}
          </button>
        </div>
      </div>
      <div
        className={`${
          isCollapsed ? 'ml-20' : 'ml-64'
        } w-full bg-soft min-h-[100vh] px-6 pt-6`}
        style={{ maxWidth: !isCollapsed ? 'calc(100vw - 16rem)' : '' }}
      >
        <div className="font-semibold text-lg text-right mb-4">
          Hi, {email} 👋🏼
        </div>
        {children}
      </div>
    </>
  )
}

export default Sidebar
