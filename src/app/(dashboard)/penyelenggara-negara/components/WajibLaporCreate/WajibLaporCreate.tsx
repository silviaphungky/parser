import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
import { Dispatch, SetStateAction, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from '@/constants/apiUrl'
import toast, { Toaster } from 'react-hot-toast'

interface FormValues {
  name: string
  nik: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Nama wajib diisi'),
  nik: yup.string().required('NIK wajib diisi'),
})

const baseUrl =
  'https://6170d78b-4b3c-4f02-a452-311836aaf499-00-274dya67izywv.sisko.replit.dev'

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
  console.log({ token }, 'post')
  const { mutate } = useMutation({
    mutationFn: (payload: { nik: string; name: string }) =>
      axios.post(
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
      <Toaster />
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

        <button
          type="submit"
          className="mt-6 text-sm bg-black w-full text-white px-4 py-2 rounded-md hover:opacity-95"
        >
          Tambah
        </button>
      </form>
    </div>
  )
}

export default WajibLaporCreate
