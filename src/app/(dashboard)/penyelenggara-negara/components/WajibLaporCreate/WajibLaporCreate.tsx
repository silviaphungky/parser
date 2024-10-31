import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormItem, Input } from '@/components'
import { useState } from 'react'

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

// Dummy data for family member names
const familyMemberOptions = [
  { value: 'john_doe', label: 'John Doe' },
  { value: 'jane_doe', label: 'Jane Doe' },
  { value: 'susan_lee', label: 'Susan Lee' },
  { value: 'mike_smith', label: 'Mike Smith' },
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

const WajibLaporCreate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {} as FormValues,
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
    setIsOpen(true)
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
            render={({ fieldState: { error }, ...fields }) => (
              <FormItem label="Nama" errorMessage={error?.message}>
                <Input
                  {...fields}
                  placeholder="Masukkan nama"
                  className="w-full"
                  errorMessage={error?.message}
                />
              </FormItem>
            )}
          />
        </div>
        {/* NIK */}
        <div>
          <Controller
            name="nik"
            control={control}
            render={({ fieldState: { error }, ...fields }) => (
              <FormItem label="NIK" errorMessage={error?.message}>
                <Input
                  placeholder="Masukkan NIK"
                  className="w-full"
                  type="number"
                  {...fields}
                  errorMessage={error?.message}
                />
              </FormItem>
            )}
          />
        </div>
        {/* {isShowFamilyField && (
          <>
            <LineSeparator />
            <div className="mb-4 p-4 border rounded-md">
              {fields.map((field, index) => (
                <>
                  <div key={field.id} className="flex gap-4">
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`familyMembers.${index}.member`}
                        render={({ field, fieldState }) => (
                          <FormItem
                            label="Family Name"
                            errorMessage={fieldState.error?.message}
                          >
                            <Select
                              className="react-select-container"
                              options={familyMemberOptions}
                              isClearable
                              placeholder="Select family member..."
                              theme={(theme) => ({
                                ...theme,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#E6EFF5',
                                  primary: '#C8D1D6',
                                },
                              })}
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`familyMembers.${index}.role`}
                        render={({ field, fieldState }) => (
                          <FormItem
                            label="Role"
                            errorMessage={fieldState.error?.message}
                          >
                            <Select
                              className="react-select-container"
                              options={roleOptions}
                              isClearable
                              placeholder="Select role..."
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    {field.role.value === 'other' && (
                      <Controller
                        name="nik"
                        control={control}
                        render={({ fieldState: { error }, ...fields }) => (
                          <FormItem label="Specify Role">
                            <Input
                              className="w-full"
                              type="text"
                              {...fields}
                              errorMessage={error?.message}
                            />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="flex gap-4 mt-6 justify-end">
                    <button
                      className="text-sm font-semibold"
                      onClick={() => {
                        setIsShowFamilyField(false)
                        remove(index)
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-sm border border-black px-4 py-1 rounded hover:opacity-70"
                      onClick={() => {
                        update(index, {
                          ...field,
                        })
                      }}
                    >
                      Add
                    </button>
                  </div>
                </>
              ))}
            </div>
          </>
        )} */}
        {/* Add Family Member Button */}
        {/* {!isShowFamilyField && (
          <div
            onClick={() => {
              setIsShowFamilyField(true)
              append({
                member: {
                  value: '',
                  label: '',
                },
                role: {
                  value: '',
                  label: '',
                },
                otherRole: '',
              })
            }}
            className="text-gray-500 text-sm cursor-pointer"
          >
            + Add Family Member
          </div>
        )} */}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 text-sm bg-primary w-full text-white px-4 py-2 rounded-md hover:opacity-95"
        >
          Tambah
        </button>
      </form>
    </div>
  )
}

export default WajibLaporCreate
