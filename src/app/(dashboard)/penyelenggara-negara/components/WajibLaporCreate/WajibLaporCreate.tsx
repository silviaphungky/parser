import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
import { Dispatch, SetStateAction, useState } from 'react'

interface FamilyMember {
  member: {
    value: string
    label: string
  }
  role: {
    value: string
    label: string
  }
  otherRole?: string
}

interface FormValues {
  name: string
  nik: number
}

const roleOptions = [
  { value: 'children', label: 'Children' },
  { value: 'wife/husband', label: 'Wife/Husband' },
  { value: 'parents', label: 'Parents' },
  { value: 'other', label: 'Other' },
]

const validationSchema = yup.object().shape({
  name: yup.string().required('Nama wajib diisi'),
  nik: yup
    .number()
    .typeError('NIK harus angka')
    .required('NIK wajib diisi')
    .positive('NIK must be positive')
    .integer('NIK must be an integer'),
})

const WajibLaporCreate = ({
  setIsOpenFoundModal,
  setIsOpenCreateModal,
}: {
  setIsOpenFoundModal: Dispatch<SetStateAction<boolean>>
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>
}) => {
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
    console.log(data)
    setIsOpenCreateModal(false)
    setIsOpenFoundModal(true)

    // Handle form submission
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
                  type="number"
                  {...field}
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
