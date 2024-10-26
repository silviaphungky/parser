import React, { ReactNode, useState } from 'react'

interface TabItem {
  id: string
  label: string
  content: ReactNode
  active: boolean
  handleClick: () => void
}

interface TabProps {
  tabs: TabItem[]
}

const Tab: React.FC<TabProps> = ({ tabs }) => {
  return (
    <div className="tab-component">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              tab.handleClick()
            }}
            className={`py-2 px-4 focus:outline-none text-sm ${
              tab.active
                ? 'border-b-2 border-primary font-bold'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.map((tab) => tab.active && <div key={tab.id}>{tab.content}</div>)}
      </div>
    </div>
  )
}

export default Tab
