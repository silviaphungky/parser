import { FormItem, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { IconBCA, IconBNI, IconBRI, IconMandiri, IconUpload } from '@/icons'
import IconFile from '@/icons/IconFile'
import React, { Dispatch, useState } from 'react'

const BANK_OPTIONS = [
  {
    id: 'BCA',
    label: 'BCA',
    icon: <IconBCA size={24} />,
  },
  {
    id: 'BNI',
    label: 'BNI',
    icon: <IconBNI size={24} />,
  },
  {
    id: 'BRI',
    label: 'BRI',
    icon: <IconBRI size={24} />,
  },
  {
    id: 'Mandiri',
    label: 'Mandiri',
    icon: <IconMandiri size={24} />,
  },
]

const UploadBankStatement = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<boolean>
}) => {
  const [selectedBank, setSelectedBank] = useState<{
    id: string | number
    label: string
  }>(BANK_OPTIONS[0])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.')
        setFile(null)
        return
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB.')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a valid PDF file.')
      return
    }

    // Handle file upload logic here, such as sending to a server
    console.log('File ready to upload:', file)
  }

  const handleChangeBank = (option: { id: string | number; label: string }) => {
    setSelectedBank(option)
  }

  const handleUpload = () => {
    if (!error && file) {
      console.log(file, selectedBank)
      setIsOpen(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      width="max-w-[30rem]"
      onClose={() => setIsOpen(false)}
    >
      <h2 className="text-xl font-bold mb-4">Unggah Laporan Bank</h2>
      <div className="mb-4">
        <FormItem label="Select Bank">
          <InputDropdown
            value={selectedBank}
            options={BANK_OPTIONS}
            onChange={handleChangeBank}
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
              Max size: 5MB. Format file .pdf
            </div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden" // Hides the input
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          className="mt-2 text-sm bg-black w-full text-white px-4 py-2 rounded-md hover:opacity-95"
          onClick={handleUpload}
        >
          Unggah
        </button>
      </form>
    </Modal>
  )
}

export default UploadBankStatement
