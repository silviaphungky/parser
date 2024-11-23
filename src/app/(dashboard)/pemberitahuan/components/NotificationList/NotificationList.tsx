// app/notifications/page.tsx
'use client'

import { Pagination } from '@/components'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const mockNotifications = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Notification ${i + 1}`,
  message: `This is the detail of notification ${i + 1}.`,
  isRead: i % 3 === 0, // Mock: Mark every 3rd notification as read.
}))

const ITEMS_PER_PAGE = 5

const NotificationList = ({ token }: { token: string }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [notifications, setNotifications] = useState(mockNotifications)

  const { data, isLoading, refetch } = useQuery<{
    notification_list: Array<any>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: ['notifList', currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URL.NOTIF_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = response.data
      return data.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  console.log({ data })

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE)

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {paginatedNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 border rounded-lg ${
              notif.isRead ? 'bg-gray-100' : 'bg-white'
            } shadow-sm`}
          >
            <h2 className="text-lg font-medium">{notif.title}</h2>
            <p className="text-sm text-gray-600">{notif.message}</p>
            {!notif.isRead && (
              <button
                onClick={() => handleMarkAsRead(notif.id)}
                className="mt-2 text-blue-500 hover:underline"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        totalItems={100}
        itemsPerPage={5}
        onItemsPerPageChange={() => {}}
      />
    </div>
  )
}

export default NotificationList
