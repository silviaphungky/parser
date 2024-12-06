'use client'
import axiosInstance from '@/utils/axiosInstance'

const baseUrl = 'https://backend-itrtechkpk.replit.app'

export async function getPNList(url: string, token: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await axiosInstance.get(`${baseUrl}/${url}`, { headers })
  const data = response.data
  return data.data
}
