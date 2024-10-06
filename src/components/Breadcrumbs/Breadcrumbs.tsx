'use client'
import { Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { IconChevronDown } from '@/icons'

const Breadcrumbs = ({
  routes,
}: {
  routes: Array<{ label: string; link?: string }>
}) => {
  const router = useRouter()
  return (
    <div className="flex gap-1 items-center">
      {routes.map((item, index) => {
        const isLastItem = index === routes.length - 1
        return (
          <Fragment key={item.label}>
            <div
              key={`breadcrumb-${item.label}`}
              className={`text-xs ${
                item.link ? 'text-primary cursor-pointer' : 'text-dark'
              } ${isLastItem ? 'font-bold' : ''}`}
              onClick={() => {
                if (item.link) {
                  router.push(item.link)
                }
              }}
            >
              {item.label}
            </div>
            {!isLastItem && (
              <div className="-rotate-90">
                <IconChevronDown color={'#9CA3AF'} size={20} />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default Breadcrumbs
