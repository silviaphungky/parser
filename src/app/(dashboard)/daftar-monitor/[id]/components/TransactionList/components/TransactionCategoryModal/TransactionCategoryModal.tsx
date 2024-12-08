'use client'
import { Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import axiosInstance from '@/utils/axiosInstance'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, useState } from 'react'
import { API_URL } from '@/constants/apiUrl'
import toast from 'react-hot-toast'

export const mockCategoryOptions = [
  { id: 'GAJI/PENDAPATAN', label: 'Gaji/Pendapatan' },
  { id: 'PENDAPATAN_SEWA', label: 'Pendapatan Sewa' },
  { id: 'TAGIHAN_UTILITAS', label: 'Tagihan Utilitas' },
  { id: 'PEMBAYARAN_SEWA/KPR', label: 'Pembayaran Sewa/KPR' },
  { id: 'BELANJA_HARIAN', label: 'Belanja Harian' },
  { id: 'TRANSPORTASI', label: 'Transportasi' },
  { id: 'MAKAN_DI_LUAR', label: 'Makan di Luar' },
  { id: 'HIBURAN', label: 'Hiburan' },
  { id: 'PEMBAYARAN_ASURANSI', label: 'Pembayaran Asuransi' },
  { id: 'PELUNASAN_PINJAMAN', label: 'Pelunasan Pinjaman' },
  { id: 'PEMBAYARAN_KARTU_KREDIT', label: 'Pembayaran Kartu Kredit' },
  { id: 'INVESTASI', label: 'Investasi' },
  { id: 'SETORAN_TABUNGAN', label: 'Setoran Tabungan' },
  { id: 'PENARIKAN_TUNAI', label: 'Penarikan Tunai' },
  { id: 'BIAYA_MEDIS', label: 'Biaya Medis' },
  { id: 'BIAYA_PENDIDIKAN', label: 'Biaya Pendidikan' },
  { id: 'BELANJA', label: 'Belanja' },
  { id: 'HADIAH_DAN_DONASI', label: 'Hadiah dan Donasi' },
  { id: 'BIAYA', label: 'Biaya' },
  { id: 'PAJAK', label: 'Pajak' },
  { id: 'TRANSFER', label: 'Transfer' },
  { id: 'PENGEMBALIAN_DANA_REFUNDS', label: 'Pengembalian Dana (Refunds)' },
  { id: 'PENDAPATAN_LAIN-LAIN', label: 'Pendapatan Lain-lain' },
  { id: 'PENGELUARAN_LAIN-LAIN', label: 'Pengeluaran Lain-lain' },
]

const TransactionCategoryModal = ({
  baseUrl,
  refetch,
  transactionId,
  category,
  token,
  isOpen,
  onClose,
  setIsOpenCategoryModal,
}: {
  baseUrl: string
  refetch: () => void
  transactionId: string
  category: string
  token: string
  isOpen: boolean
  onClose: () => void
  setIsOpenCategoryModal: Dispatch<boolean>
}) => {
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string | number
    label: string
  }>(
    {} as {
      id: string | number
      label: string
    }
  )

  const { mutate } = useMutation({
    mutationFn: (payload: { category_name: string }) =>
      axiosInstance.patch(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${transactionId}/category`,
        {
          category_name: payload.category_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const { mutate: resetCategory } = useMutation({
    mutationFn: () =>
      axiosInstance.patch(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${transactionId}/category/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpenCategoryModal(false)
        setSelectedCategory({} as { id: string | number; label: string })
      }}
    >
      <h2 className="font-semibold text-lg">Sesuaikan Kategori</h2>
      <div className="mt-2 text-sm">
        Kategori untuk transaksi ini telah ditentukan secara otomatis oleh
        sistem. Namun, jika terdapat kategori yang kurang tepat, Anda dapat
        menyesuaikannya.
      </div>
      <div className="text-sm mt-3 mb-2">
        Pilih kategori yang paling relevan untuk memastikan data tetap akurat.
      </div>
      <InputDropdown
        options={mockCategoryOptions}
        value={selectedCategory}
        onChange={setSelectedCategory}
        placeholder="Pilih kategori..."
      />

      <div className="text-xs mt-2 text-gray-600">{`*Kategori awal: ${category}`}</div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={() => {
            setIsOpenCategoryModal(false)
            setSelectedCategory({ id: '', label: '' })
          }}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          className="bg-black text-white font-semibold text-sm px-4 py-2 rounded-md hover:opacity-80"
          onClick={() => {
            resetCategory(undefined, {
              onSuccess: () => {
                toast.success(`Berhasil mengatur ulang ke kategori awal`)
                refetch()
                onClose()
                setSelectedCategory({ id: '', label: '' })
              },
              onError: (error: any) => {
                toast.error(
                  `Gagal mengatur ulang ke kategori awal: ${error?.response?.data?.message}`
                )
              },
            })
          }}
        >
          Atur Ulang ke Kategori Awal
        </button>

        <button
          onClick={() => {
            mutate(
              {
                category_name: selectedCategory.id as string,
              },
              {
                onSuccess: () => {
                  toast.success('Berhasil memperbarui kategori')
                  refetch()
                  onClose()
                  setSelectedCategory(
                    {} as { id: string | number; label: string }
                  )
                  setSelectedCategory({ id: '', label: '' })
                },
                onError: (error: any) => {
                  toast.error(
                    `Gagal memperbarui kategori: ${error?.response?.data?.message}`
                  )
                },
              }
            )
          }}
          className="font-semibold bg-primary text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
        >
          Simpan Perubahan
        </button>
      </div>
    </Modal>
  )
}

export default TransactionCategoryModal
