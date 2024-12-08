'use client'
import axiosInstance from '@/utils/axiosInstance'

const baseUrl =
  'https://499e2567-eab8-4cda-bdb4-d2dd8fb584b8-00-2ns1p7d6pfgj6.pike.repl.co'

export async function getPNList(url: string, token: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await axiosInstance.get(`${baseUrl}/${url}`, { headers })
  const data = response.data
  return data.data
}
