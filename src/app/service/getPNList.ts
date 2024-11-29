'use client'
import axiosInstance from '@/utils/axiosInstance'

const baseUrl =
  'https://6170d78b-4b3c-4f02-a452-311836aaf499-00-274dya67izywv.sisko.replit.dev'

export async function getPNList(url: string, token: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await axiosInstance.get(`${baseUrl}/${url}`, { headers })
  const data = response.data
  return data.data
}
