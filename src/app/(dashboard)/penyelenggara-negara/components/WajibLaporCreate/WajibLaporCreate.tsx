import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
import { Dispatch, SetStateAction, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from '@/constants/apiUrl'
import toast, { Toaster } from 'react-hot-toast'
import Button from '@/components/Button'
import axiosInstance from '@/utils/axiosInstance'

interface FormValues {
  name: string
  nik: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Nama wajib diisi'),
  nik: yup.string().required('NIK wajib diisi'),
})

const baseUrl = 'https://backend-itrtechkpk.replit.app'

const notify = () => toast.success('PN berhasil ditambahkan')

const WajibLaporCreate = ({
  token,
  setIsOpenFoundModal,
  setIsOpenCreateModal,
  refetch,
}: {
  token: string
  setIsOpenFoundModal: Dispatch<SetStateAction<boolean>>
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>
  refetch: () => void
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { nik: string; name: string }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.CREATE_PN}`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: ({ data }) => {
      refetch()
      setIsOpenCreateModal(false)
      notify()
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {} as FormValues,
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const onSubmit = (data: FormValues) => {
    //  NOTE: search dulu NIK duplicate atau tidak, GET by api
    const isExists = false
    if (isExists) {
      setIsOpenFoundModal(true)
    } else
      mutate({
        nik: data.nik,
        name: data.name,
      })
  }

  return (
    <div>
      <h2 className="font-semibold mb-4 text-lg">
        Tambah Penyelenggara Negara
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg ">
        <div className="w-full">
          <Controller
            name="name"
            control={control}
            render={({ fieldState: { error }, field }) => (
              <FormItem label="Nama" errorMessage={error?.message}>
                <Input
                  {...field}
                  placeholder="Masukkan nama"
                  className="w-full"
                  errorMessage={error?.message}
                />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Controller
            name="nik"
            control={control}
            render={({ fieldState: { error }, field }) => (
              <FormItem label="NIK" errorMessage={error?.message}>
                <Input
                  placeholder="Masukkan NIK"
                  className="w-full"
                  type="text"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value.replace(/\D/g, ''))
                  }}
                  errorMessage={error?.message}
                />
              </FormItem>
            )}
          />
        </div>
        <Button variant="dark" type="submit" loading={isPending} full>
          Tambah
        </Button>
      </form>
    </div>
  )
}

export default WajibLaporCreate
