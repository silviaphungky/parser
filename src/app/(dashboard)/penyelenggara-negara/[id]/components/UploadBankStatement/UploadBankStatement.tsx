import { FormItem, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import { IconBCA, IconBNI, IconBRI, IconMandiri, IconUpload } from '@/icons'
import IconFile from '@/icons/IconFile'
import axiosInstance from '@/utils/axiosInstance'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import React, { Dispatch, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

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
    id: 'idr',
    label: 'IDR',
  },
  {
    id: 'usd',
    label: 'USD',
  },
  {
    id: 'JPY',
    label: 'JPY',
  },
]

const baseUrl = 'https://backend-itrtechkpk.replit.app'

const notify = () => toast.success('Laporan bank berhasil dihapus')

const UploadBankStatement = ({
  token,
  isOpen,
  setIsOpen,
  name,
  nik,
}: {
  token: string
  isOpen: boolean
  setIsOpen: Dispatch<boolean>
  name: string
  nik: string
}) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 5MB.')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const { mutate } = useMutation({
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
    formData.append('name', name)
    formData.append('nik', nik)
    formData.append('institution_id', `${selectedBank.id}`)
    formData.append('statement', file)
    formData.append('type', 'INDIVIDUAL')

    // NOTE: tunggu api BE
    mutate(formData, {
      onSuccess: () => {
        notify()
        setIsOpen(false)
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
      onClose={() => setIsOpen(false)}
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
              Ukuran maksimal: 5MB. Mendukung format file .xls, .xlsx, dan .txt
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

        <button
          type="submit"
          className="mt-2 text-sm bg-black w-full text-white px-4 py-2 rounded-md hover:opacity-95"
        >
          Unggah
        </button>
      </form>
    </Modal>
  )
}

export default UploadBankStatement
