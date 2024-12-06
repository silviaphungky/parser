'use client'
import React, { useState } from 'react'
import { useForm, SubmitHandler, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import axios from 'axios'
import IconBatik from '@/icons/IconBatik'
import Button from '@/components/Button'
import toast from 'react-hot-toast'

const schema = yup.object().shape({
  email: yup.string().email().required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
})

interface IFormInput {
  email: string
  password: string
}

const Login = ({
  handleSetSession,
  baseUrl,
}: {
  handleSetSession: (token: string, email: string, role: string) => void
  baseUrl: string
}) => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isNewAcc, setIsNewAcc] = useState(false)
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  })

  const email = useWatch({
    name: 'email',
    control,
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
    onSuccess: async ({ data }) => {
      const response = data.data || {}
      const token = response.token
      const user = response.user || {}
      const role = user.role_name
      await handleSetSession(token, email, role)

      router.push('/daftar-monitor')
    },
    onError: async (error: any) => {
      toast.error(error?.response?.data?.message)
    },
  })

  const { mutateAsync: regisNewAccount, isPending: isRegisting } = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await axios.patch(
        `${baseUrl}/${API_URL.REGIS_PASSWORD}`,
        {
          ...payload,
        }
      )
      return response.data.data
    },
  })

  const { mutate: checkAccount, isPending: isChecking } = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await axios.post(`${baseUrl}/${API_URL.CHECK_ACCOUNT}`, {
        ...payload,
      })
      const data = response.data
      return data.data
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message)
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (isNewAcc) {
      try {
        const data1 = await regisNewAccount({
          email: data.email,
          password: data.password,
        })
        mutate({
          email: data.email,
          password: data.password,
          is_remember_me: true,
        })
      } catch (error: any) {
        toast.error(`Gagal masuk ke sistem: ${error?.response?.data?.message}`)
      }
    } else {
      mutate({
        email: data.email,
        password: data.password,
        is_remember_me: true,
      })
    }
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
        <div className="w-full max-w-md">
          <div className="flex gap-0 items-center justify-center mb-6">
            <img src="/logo-kpk.png" width={125} alt="logo" />
            <div className="font-semibold text-lg ">Parser</div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)()
            }}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
          >
            <h2 className="text-center text-2xl mb-4 font-semibold">Masuk</h2>

            {step === 1 && (
              <>
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
                <Button
                  loading={isChecking}
                  variant="primary"
                  full
                  onClick={() => {
                    checkAccount(
                      {
                        email,
                      },
                      {
                        onSuccess: (data) => {
                          setIsNewAcc(data.is_need_add_password)
                          setStep(2)
                        },
                        onError: (error: any) => {
                          toast.error(
                            `Login gagal: ${error?.response?.data?.message}`
                          )
                        },
                      }
                    )
                  }}
                >
                  Selanjutnya
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-6">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem
                        label={isNewAcc ? 'Atur Password Baru' : 'Password'}
                        errorMessage={error?.message}
                      >
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

                <Button
                  type="submit"
                  loading={isPending}
                  variant="primary"
                  full
                >
                  {isNewAcc ? 'Atur Password dan Masuk' : 'Masuk'}
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
