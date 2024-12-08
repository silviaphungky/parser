'use client'
import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL:
    'https://499e2567-eab8-4cda-bdb4-d2dd8fb584b8-00-2ns1p7d6pfgj6.pike.replit.dev', // Your API URL from environment variables
  headers: {
    'Content-Type': 'application/json',
  },
})

const queryClient = new QueryClient()

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error = {}) => {
    const errorMessage = error.response?.data?.message

    if (error.response && error.response.status === 401) {
      queryClient.cancelQueries()
      window.location.href = '/login'
      toast.error(errorMessage, {
        style: {
          fontSize: '14px',
        },
      })
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
