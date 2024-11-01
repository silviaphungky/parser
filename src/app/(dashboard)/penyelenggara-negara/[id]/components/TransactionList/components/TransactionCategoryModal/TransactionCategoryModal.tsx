'use client'
import { Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { useState } from 'react'

const categoryOptions = [
  {
    id: 'shopping',
    label: 'Belanja',
  },
  {
    id: 'investment',
    label: 'Investasi',
  },
  {
    id: 'travel',
    label: 'Wisata',
  },
]

const TransactionCategoryModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string | number
    label: string
  }>(
    categoryOptions[0] as {
      id: string | number
      label: string
    }
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
        options={categoryOptions}
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={() => {
            onClose()
          }}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          onClick={() => {
            // hit BE API
            onClose()
          }}
          className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
        >
          Simpan Perubahan
        </button>
      </div>
    </Modal>
  )
}

export default TransactionCategoryModal
