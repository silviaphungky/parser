import { Modal } from '@/components'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useState } from 'react'
import { baseUrl } from '../../../UploadBankStatement/UploadBankStatement'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

const TransactionNoteModal = ({
  token,
  initialNote,
  isOpen,
  onClose,
  setIsOpen,
}: {
  token: string
  initialNote?: string
  isOpen: boolean
  onClose: () => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { id } = useParams()
  const [note, setNote] = useState(initialNote)
  const { mutate } = useMutation({
    mutationFn: (payload: { note?: string }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${id}/note`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h2 className="text-lg font-semibold mb-4">Catatan</h2>
      <textarea
        value={note}
        onChange={(e) => {
          const value = e.target.value
          setNote(value)
        }}
        className="w-full text-sm h-20 p-2 border border-gray-300 rounded 
            focus:outline-none focus:ring-2
           focus:ring-blue-500 resize-none"
        placeholder="Masukkan catatan..."
      />
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={() => {
            setIsOpen(false)
          }}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          onClick={() => {
            mutate(
              {
                note,
              },
              {
                onSuccess: () => {
                  toast.success('Berhasil memperbarui catatan')
                  onClose()
                  setNote('')
                },
                onError: (error: any) => {
                  toast.error(
                    `Gagal memperbarui catatan: ${error?.response?.data?.message}`
                  )
                },
              }
            )
          }}
          className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
        >
          Simpan
        </button>
      </div>
    </Modal>
  )
}

export default TransactionNoteModal