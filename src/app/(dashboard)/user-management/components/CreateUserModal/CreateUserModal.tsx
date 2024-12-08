import { FormItem, Input, Modal } from '@/components'
import Button from '@/components/Button'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

const validationSchema = yup.object().shape({
  email: yup.string().email('Format email salah').required('Email wajib diisi'),
})

const CreateUserModal = ({
  baseUrl,
  token,
  isOpen,
  setIsOpen,
  refetch,
}: {
  baseUrl: string
  token: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  refetch: () => void
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(validationSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { email: string }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.CREATE_USER}`,
        {
          ...payload,
          is_active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const handleCreateUser = (value: { email: string }) => {
    mutate(
      {
        email: value.email,
      },
      {
        onSuccess: () => {
          toast.success('Berhasil membuat pengguna')
          refetch()
          reset()
          setIsOpen(false)
        },
        onError: (error: any) => {
          toast.error(
            `Berhasil membuat pengguna: ${error?.response?.data?.message}`
          )
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
        reset()
      }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormItem label="Email" errorMessage={error?.message}>
              <Input
                className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Masukkan email..."
                {...field}
                errorMessage={error?.message}
              />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              setIsOpen(false)
              reset()
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>

          <Button
            variant="dark"
            loading={isPending}
            onClick={handleSubmit(handleCreateUser)}
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateUserModal
