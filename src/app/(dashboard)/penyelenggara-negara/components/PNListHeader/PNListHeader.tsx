'use client'
import { Modal, Title } from '@/components'
import WajibLaporCreate from '../WajibLaporCreate'
import dayjs from 'dayjs'
import { useState } from 'react'
import { IconPlus } from '@/icons'

const PNListHeader = ({
  token,
  refetch,
}: {
  token: string
  refetch: () => void
}) => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const [isOpenFoundModal, setIsOpenFoundModal] = useState(false)
  const [existsPn, setExistsPn] = useState(
    {} as {
      nik?: string
      name?: string
      created_at?: string
      is_exist: boolean
    }
  )

  return (
    <div>
      <Modal
        isOpen={isOpenFoundModal}
        onClose={() => setIsOpenFoundModal(false)}
      >
        <h2 className="font-semibold mb-4 text-lg">
          Tambahkan Penyelenggara Negara
        </h2>
        <div className="mt-2 text-sm">
          <span className="font-semibold">{existsPn.nik} </span>
          <span>telah terdaftar sebagai Penyelenggara Negara dengan nama</span>
          <span className="font-semibold"> {existsPn.name} </span>
          <span>pada {dayjs(existsPn.created_at).format('DD/MM/YYYY')}.</span>
        </div>
        <div className="text-sm mt-2">
          Apakah Anda ingin menambahkan {<strong>{existsPn.nik}</strong>}{' '}
          sebagai daftar yang akan Anda pantau?
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => {
              setIsOpenFoundModal(false)
              setExistsPn({} as any)
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={() => {
              setIsOpenFoundModal(false)
            }}
            className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
          >
            Simpan
          </button>
        </div>
      </Modal>
      <Modal
        width="max-w-[30rem]"
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      >
        <WajibLaporCreate
          token={token}
          setIsOpenFoundModal={setIsOpenFoundModal}
          setIsOpenCreateModal={setIsOpenCreateModal}
          refetch={refetch}
          setExistsPn={setExistsPn}
        />
      </Modal>
      <div className="flex justify-between">
        <Title title="Penyelenggara Negara" />
        <button
          className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <IconPlus color="#fff" size={18} />
          Tambah Penyelenggara Negara
        </button>
      </div>
    </div>
  )
}

export default PNListHeader
