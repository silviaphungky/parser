'use client'
import { FormItem, Modal } from '@/components'
import Button from '@/components/Button'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import { IconBCA, IconBNI, IconBRI, IconMandiri, IconUpload } from '@/icons'
import IconFile from '@/icons/IconFile'
import axiosInstance from '@/utils/axiosInstance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { Dispatch, useState } from 'react'
import toast from 'react-hot-toast'

const BANK_OPTIONS = [
  {
    id: 1,
    label: 'BCA',
    icon: <IconBCA size={24} />,
  },
  {
    id: 3,
    label: 'BNI',
    icon: <IconBNI size={24} />,
  },
  {
    id: 4,
    label: 'BRI',
    icon: <IconBRI size={24} />,
  },
  {
    id: 2,
    label: 'Mandiri',
    icon: <IconMandiri size={24} />,
  },
]

const CURRENCY_OPTIONS = [
  {
    id: 'IDR',
    label: 'IDR',
  },
  {
    id: 'USD',
    label: 'USD',
  },
  {
    id: 'GBP',
    label: 'GBP',
  },
  {
    id: 'SGD',
    label: 'SGD',
  },
  {
    id: 'JPY',
    label: 'JPY',
  },
]

export const baseUrl =
  'https://499e2567-eab8-4cda-bdb4-d2dd8fb584b8-00-2ns1p7d6pfgj6.pike.replit.dev'

const notify = () =>
  toast.success(
    'Laporan bank Anda telah berhasil diunggah dan sedang diproses untuk ekstraksi. Proses ini membutuhkan waktu beberapa menit. Anda bisa memantau status ekstrak di menu Daftar Laporan Bank.',
    {
      duration: 1000,
    }
  )

const UploadBankStatement = ({
  token,
  isOpen,
  setIsOpen,
}: {
  token: string
  isOpen: boolean
  setIsOpen: Dispatch<boolean>
  nik: string
}) => {
  const queryClient = useQueryClient()
  const { id } = useParams()
  const [selectedBank, setSelectedBank] = useState<{
    id: string | number
    label: string
  }>(BANK_OPTIONS[0])
  const [selectedCurrency, setSelectedCurrency] = useState<{
    id: string | number
    label: string
  }>(CURRENCY_OPTIONS[0])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { mutate: checkDuplicateFile, isPending: isCheckingDuplicate } =
    useMutation({
      mutationFn: async (payload: FormData) => {
        const response = await axiosInstance.post(
          `${baseUrl}/${API_URL.VALIDATE_STATEMENT_DUPLICATE}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        const data = response.data
        return data.data
      },
    })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB.')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FormData) =>
      axiosInstance.post(`${baseUrl}/${API_URL.UPLOAD_STATEMENT}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a valid xls, xlsx, and txt file.')
      return
    }

    const formData = new FormData()
    formData.append('account_reporter_id', id as string)
    formData.append('institution_id', `${selectedBank.id}`)
    formData.append('statement', file)
    formData.append('currency', selectedCurrency.id as string)

    checkDuplicateFile(formData, {
      onSuccess: (data) => {
        const { is_exist } = data
        if (!is_exist) {
          mutate(formData, {
            onSuccess: () => {
              notify()
              setIsOpen(false)
              setFile(null)
              setSelectedBank(BANK_OPTIONS[0])
              setSelectedCurrency(CURRENCY_OPTIONS[0])
              queryClient.invalidateQueries({
                queryKey: ['statementList'],
              })
            },
            onError: (error: any) => {
              toast.error(
                `Laporan bank gagal diunggah: ${error?.response?.data?.message}`
              )
            },
          })
        } else {
          toast.error(
            `Duplikat terdeteksi: Laporan bank ini telah diupload sebelumnya dengan nama: ${file.name}.`
          )
        }
      },
      onError: (error: any) => {
        toast.error(
          `Gagal mengupload laporan bank: ${error?.response?.data?.message}`
        )
      },
    })
  }

  const handleChangeBank = (option: { id: string | number; label: string }) => {
    setSelectedBank(option)
  }

  const handleChangeCurrency = (option: {
    id: string | number
    label: string
  }) => {
    setSelectedCurrency(option)
  }

  return (
    <Modal
      isOpen={isOpen}
      width="max-w-[30rem]"
      onClose={() => {
        setIsOpen(false)
        setFile(null)
        setSelectedBank(BANK_OPTIONS[0])
        setSelectedCurrency(CURRENCY_OPTIONS[0])
      }}
    >
      <h2 className="text-xl font-bold mb-4">Unggah Laporan Bank</h2>
      <div className="mb-4">
        <FormItem label="Pilih Bank">
          <InputDropdown
            value={selectedBank}
            options={BANK_OPTIONS}
            onChange={handleChangeBank}
          />
        </FormItem>
        <FormItem label="Pilih Mata Uang">
          <InputDropdown
            value={selectedCurrency}
            options={CURRENCY_OPTIONS}
            onChange={handleChangeCurrency}
          />
        </FormItem>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="w-full block text-center  cursor-pointer bg-gray-100 border border-dashed border-gray-400 rounded-lg p-4 hover:bg-gray-200"
          >
            {file && (
              <div className="mt-4 mb-4">
                <div className="flex items-center justify-center">
                  <IconFile size={40} color="rgb(59, 71, 82, 0.5)" />
                </div>
                <p className="text-sm font-semibold text-dark">
                  File selected: {file.name}
                </p>
              </div>
            )}

            {!file && (
              <>
                <div className="flex items-center justify-center mb-2">
                  <IconUpload size={30} color="#3B4752" />
                </div>
                <div className="text-gray-700 text-sm">Pilih Laporan Bank</div>
              </>
            )}
            <div className="text-xs text-gray-500">
              Ukuran maksimal: 10MB. Mendukung format file .xls, .xlsx, dan .txt
            </div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xls, .xlsx, .txt"
            onChange={handleFileChange}
            className="hidden" // Hides the input
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <Button
          type="submit"
          variant="dark"
          loading={isPending || isCheckingDuplicate}
          full
        >
          Unggah
        </Button>
      </form>
    </Modal>
  )
}

export default UploadBankStatement
