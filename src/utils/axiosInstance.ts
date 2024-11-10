'use client'
import axios from 'axios'
import { redirect } from 'next/navigation'
import Router from 'next/router'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: 'https://backend-itrtechkpk.replit.app', // Your API URL from environment variables
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error = {}) => {
    const errorMessage = error.response?.data?.message

    if (error.response && error.response.status === 401) {
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
