'use client'
import React from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
// import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import axios from 'axios'
import { IconLoading } from '@/icons'
import IconBatik from '@/icons/IconBatik'
import Button from '@/components/Button'

// Define the schema for validation using Yup
const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
})

// Define the types for our form inputs
interface IFormInput {
  email: string
  password: string
}

const baseUrl =
  'https://6170d78b-4b3c-4f02-a452-311836aaf499-00-274dya67izywv.sisko.replit.dev'

const Login = ({
  handleSetSession,
}: {
  handleSetSession: (token: string) => void
}) => {
  const router = useRouter()
  // Initialize the form with useForm hook
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: {
      email: string
      password: string
      is_remember_me: boolean
    }) =>
      axios.post(`${baseUrl}/${API_URL.LOGIN}`, {
        ...payload,
      }),
    onSuccess: ({ data }) => {
      const response = data.data || {}
      const token = response.token
      handleSetSession(token)
      router.push('/penyelenggara-negara')
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    mutate({
      email: 'silviaphungky7@gmail.com',
      password: 'itr1234!',
      is_remember_me: true,
    })
  }

  return (
    <div className="relative bg-light">
      <div className="flex items-center justify-center min-h-screen relative">
        <div className="absolute left-0 top-[3rem]">
          <IconBatik />
        </div>
        <div className="absolute right-0 top-[3rem]">
          <IconBatik />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(onSubmit)()
          }}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        >
          <h2 className="text-center text-2xl mb-4 font-semibold">Sign In</h2>

          <div className="mb-4">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormItem label="Email" errorMessage={error?.message}>
                  <Input
                    type="email"
                    {...field}
                    errorMessage={error?.message}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormItem label="Password" errorMessage={error?.message}>
                  <Input
                    type="password"
                    {...field}
                    errorMessage={error?.message}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" loading={isPending} variant="primary" full>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
