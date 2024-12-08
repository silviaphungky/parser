'use client'
import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
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
