import React, { ReactNode, useState } from 'react'

interface TabItem {
  id: string
  label: string
  content: ReactNode
}

interface TabProps {
  tabs: TabItem[]
}

const Tab: React.FC<TabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id) // Initialize with the first tab's id

  return (
    <div className="tab-component">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === tab.id
                ? 'border-b-2 border-primary font-bold'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.map(
          (tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
        )}
      </div>
    </div>
  )
}

export default Tab
