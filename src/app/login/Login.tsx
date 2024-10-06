'use client'
import React from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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

const Login: React.FC = () => {
  const router = useRouter()
  // Initialize the form with useForm hook
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  // Function to handle form submission
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data) // Handle your login logic here
    router.push('/overview')
  }

  return (
    <div className="relative bg-light">
      <div className="flex items-center justify-center min-h-screen relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        >
          <h2 className="text-center text-2xl mb-4">Login</h2>

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

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
