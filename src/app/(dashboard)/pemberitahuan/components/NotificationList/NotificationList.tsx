// app/notifications/page.tsx
'use client'

import { baseUrl } from '@/app/(dashboard)/daftar-monitor/[id]/components/UploadBankStatement/UploadBankStatement'
import { Card, Pagination, Shimmer } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const filterOptions = [
  {
    id: '',
    label: 'Semua Pemberitahuan',
  },
  {
    id: 'UNREAD',
    label: 'Pemberitahuan Belum dibaca',
  },
]

const NotificationList = ({ token }: { token: string }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(20)
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0])

  const {
    data = {
      notification_list: [],
      meta_data: { total_page: 1, total: 1, page: 1 },
    },
    isLoading,
    refetch,
  } = useQuery<{
    notification_list: Array<{
      app_user_id: string
      created_at: string
      id: string
      is_read: boolean
      message: string
      read_at: string
    }>
    meta_data: {
      total: number
      limit: number
      current_page: number
      total_page: number
    }
  }>({
    queryKey: ['notifList', currentPage, itemsPerPage, selectedFilter.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URL.NOTIF_LIST}`, {
        params: {
          status: selectedFilter.id,
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = response.data
      return data.data
    },
    refetchOnWindowFocus: false,
  })

  const notifList = data?.notification_list || []

  const { mutate: markAsRead } = useMutation({
    mutationFn: (payload: { notification_id: Array<string> }) =>
      axiosInstance.patch(
        `${baseUrl}/${API_URL.NOTIF_READ}`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const handleMarkAsRead = (payload: Array<string>) => {
    markAsRead(
      {
        notification_id: payload,
      },
      {
        onSuccess: () => {
          refetch()
          toast.success('Pemberitahuan telah dibaca')
        },
        onError: (error: any) => {
          toast.error(
            `Gagal memperbarui pemberitahuan: ${error?.response?.data?.message}`
          )
        },
      }
    )
  }

  return (
    <div className="mt-4">
      {notifList.length > 0 && (
        <Card className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={() => handleMarkAsRead([])}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Tandai semua sebagai dibaca
            </button>
          </div>

          <div>
            <InputDropdown
              options={filterOptions}
              value={selectedFilter}
              onChange={(option) => {
                setSelectedFilter(option as { id: string; label: string })
              }}
            />
          </div>
        </Card>
      )}
      {isLoading && <Shimmer />}
      {!isLoading && (
        <div className="space-y-4">
          {notifList.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 border rounded-lg ${'bg-white'}`}
            >
              <h2 className="text-sm">{notif.message}</h2>
              {!notif.read_at && (
                <button
                  onClick={() => handleMarkAsRead([notif.id])}
                  className="mt-2 text-xs text-blue-500 hover:underline"
                >
                  Tandai sebagai dibaca
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
      {!isLoading && notifList.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-medium">
            Tidak ada pemberitahuan yang tersedia
          </p>
        </div>
      )}
      {notifList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.meta_data.total_page}
          onPageChange={setCurrentPage}
          totalItems={data.meta_data.total}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemPerPage}
        />
      )}
    </div>
  )
}

export default NotificationList
