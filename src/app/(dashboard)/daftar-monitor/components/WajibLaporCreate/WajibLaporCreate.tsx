import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
import { Dispatch, SetStateAction, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/constants/apiUrl'
import toast from 'react-hot-toast'
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

const baseUrl =
  'https://499e2567-eab8-4cda-bdb4-d2dd8fb584b8-00-2ns1p7d6pfgj6.pike.repl.co'

const notify = () => toast.success('PN berhasil ditambahkan')

const WajibLaporCreate = ({
  token,
  setIsOpenFoundModal,
  setIsOpenCreateModal,
  refetch,
  setExistsPn,
}: {
  token: string
  setIsOpenFoundModal: Dispatch<SetStateAction<boolean>>
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>
  setExistsPn: Dispatch<{
    name?: string
    nik?: string
    is_exist: boolean
    created_at?: string
  }>
  refetch: () => void
}) => {
  const { mutateAsync: checkIsPNExist } = useMutation({
    mutationFn: (payload: { nik: string }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.PN_EXIST}`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: (error: any) => {
      toast.error(`Gagal menambahkan PN: ${error?.response?.data?.message}`)
    },
  })

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
    onError: (error: any) => {
      toast.error(`PN gagal ditambahkan: ${error?.response?.data?.message}`)
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

  const validateIsPNExists = async (nik: string) => {
    const response = await checkIsPNExist({
      nik,
    })
    const data = response.data || {}
    const validatePNData = data.data || {}
    if (validatePNData.is_exist) {
      setExistsPn(
        validatePNData as {
          is_exist: boolean
          name?: string
          nik?: string
          created_at?: string
        }
      )
    }
    return validatePNData
  }

  const onSubmit = async (data: FormValues) => {
    //  NOTE: search dulu NIK duplicate atau tidak, GET by api
    const { is_exist, name, created_at, nik } = await validateIsPNExists(
      data.nik
    )

    if (is_exist) {
      setIsOpenFoundModal(true)
      setIsOpenCreateModal(false)
    } else
      mutate({
        nik: data.nik,
        name: data.name,
      })
  }

  return (
    <div>
      <h2 className="font-semibold mb-4 text-lg">Tambah Daftar Monitor</h2>
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
        <div className="mt-4">
          <Button variant="dark" type="submit" loading={isPending} full>
            Tambah
          </Button>
        </div>
      </form>
    </div>
  )
}

export default WajibLaporCreate
