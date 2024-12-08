'use client'
import { Modal, Title } from '@/components'
import WajibLaporCreate from '../WajibLaporCreate'
import dayjs from 'dayjs'
import { useState } from 'react'
import { IconPlus } from '@/icons'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'
import toast from 'react-hot-toast'

const notify = () =>
  toast.success('PN berhasil ditambahkan sebagai daftar monitor')

const PNListHeader = ({
  baseUrl,
  token,
  refetch,
}: {
  baseUrl: string
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

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { nik: string; name: string }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.CREATE_PN}`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: () => {
      refetch()
      setIsOpenCreateModal(false)
      setIsOpenFoundModal(false)
      notify()
    },
    onError: () => {
      toast.error('Gagal menambahkan PN sebagai daftar monitor')
    },
  })

  return (
    <div>
      <Modal
        isOpen={isOpenFoundModal}
        onClose={() => setIsOpenFoundModal(false)}
      >
        <h2 className="font-semibold mb-4 text-lg">Tambahkan Daftar Monitor</h2>
        <div className="mt-2 text-sm">
          <span className="font-semibold">{existsPn.nik} </span>
          <span>telah terdaftar sebagai Daftar Monitor dengan nama</span>
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
              mutate({
                name: existsPn.name as string,
                nik: existsPn.nik as string,
              })
            }}
            className="bg-black text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
          >
            Tambahkan
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
        <Title title="Daftar Monitor" />
        <button
          className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <IconPlus color="#fff" size={18} />
          Tambah Daftar Monitor
        </button>
      </div>
    </div>
  )
}

export default PNListHeader
