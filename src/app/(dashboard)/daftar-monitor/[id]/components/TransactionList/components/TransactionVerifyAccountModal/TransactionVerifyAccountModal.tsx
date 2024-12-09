import { FormItem, Input, Modal } from '@/components'
import { ITransactionItem } from '../../TransactionList'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import InputDropdown from '@/components/InputDropdown'
import { bankOptions } from '../TransactionBankDestModal/TransactionBankDestModal'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import { API_URL } from '@/constants/apiUrl'

const validationSchema = yup.object().shape({
  accountNo: yup.string().required('Wajib diisi'),
})

const TransactionVerifyAccountModal = ({
  token,
  baseUrl,
  selected,
  verifyBankAccount,
  isOpen,
  setIsOpenVerifModal,
  refetch,
  setSelected,
}: {
  token: string
  baseUrl: string
  isOpen: boolean
  selected: ITransactionItem
  verifyBankAccount: ({
    transaction_id,
    entity_name,
    entity_account_number,
    entity_bank,
    currency,
  }: {
    transaction_id: string
    entity_name: string
    entity_account_number: string
    entity_bank: string
    currency: string
  }) => Promise<{ isSuccess: boolean; error?: string; data?: any }>
  setIsOpenVerifModal: Dispatch<SetStateAction<boolean>>
  refetch: () => void
  setSelected: Dispatch<SetStateAction<ITransactionItem>>
}) => {
  const [isShowForm, setIsShowForm] = useState(!selected.is_entity_verified)
  const [selectedBank, setSelectedBank] = useState({ id: '', label: '' })
  const [stepVerify, setStepVerify] = useState(1)
  const [result, setResult] = useState(
    {} as {
      name: string
      account_number: string
      bank: string
    }
  )

  useEffect(() => {
    setIsShowForm(!selected.is_entity_verified)
  }, [selected.is_entity_verified])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      accountNo: '',
    },
    resolver: yupResolver(validationSchema),
  })

  const handleUpdate = async (value: { accountNo: string }) => {
    const { isSuccess, error, data } = await verifyBankAccount({
      transaction_id: selected.transaction_id,
      entity_name: '',
      entity_account_number: value.accountNo,
      entity_bank: selectedBank.id,
      currency: selected.currency,
    })

    if (isSuccess) {
      toast.success('Berhasil mengecek info rekening transaksi')
      setResult(data)
      setStepVerify(2)
      setSelectedBank({ id: '', label: '' })
      reset()
    } else {
      toast.error(`Gagal mengecek info rekening transaksi: ${error}`)
      setStepVerify(1)
      reset()
      setSelectedBank({ id: '', label: '' })
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: {
      entity_name: string
      entity_bank: string
      entity_account_number: string
    }) =>
      axiosInstance.patch(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${selected.transaction_id}/verified-entity`,
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
      toast.success('Info rekening lawan transaksi berhasil diperbarui')
      setIsOpenVerifModal(false)
      setSelected({} as ITransactionItem)
      setStepVerify(1)
      reset()
      setSelectedBank({ id: '', label: '' })
    },
    onError: (error: any) => {
      toast.error(
        `Gagal memperbarui info rekening lawan transaksi: ${error?.response?.data?.message}`
      )
    },
  })

  const accountNo = useWatch({
    control,
    name: 'accountNo',
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpenVerifModal(false)
        reset()
        setStepVerify(1)
        setSelectedBank({ id: '', label: '' })
        setSelected({} as ITransactionItem)
      }}
    >
      <>
        <h2 className="font-semibold text-lg">
          Konfirmasi Pengecekan Rekening
        </h2>
        {selected.is_entity_verified && !isShowForm && (
          <>
            <div className="mt-2 text-sm">
              Transaksi ini telah dilakukan pengecekan sebelumnya dengan
              informasi:
            </div>
            <div className="text-sm mt-2">{`Institusi: ${selected.entity_bank_label_verified}`}</div>
            <div className="text-sm">{`Nomor Rekening: ${selected.entity_account_number_verified}`}</div>
            <div className="text-sm">{`Nama: ${selected.entity_name_verified}`}</div>
            <div className="text-sm mt-2">
              Apakah Anda ingin tetap melakukan pengecekan ulang?
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setIsOpenVerifModal(false)
                  reset()
                  setSelectedBank({ id: '', label: '' })
                  setSelected({} as ITransactionItem)
                  setStepVerify(1)
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <Button variant="primary" onClick={() => setIsShowForm(true)}>
                Lanjut
              </Button>
            </div>
          </>
        )}
        {isShowForm && (
          <>
            {stepVerify === 1 && (
              <div>
                <div className="text-sm mt-2">
                  Masukkan detail info rekening untuk melakukan pengecekan
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <FormItem label="Bank">
                    <InputDropdown
                      placeholder="Pilih bank..."
                      options={bankOptions}
                      value={selectedBank}
                      onChange={(option) => {
                        setSelectedBank(option as { id: string; label: string })
                      }}
                    />
                  </FormItem>

                  <Controller
                    name="accountNo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem label="Nomor Rekening">
                        <Input
                          className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Masukkan rekening transaksi..."
                          {...field}
                          errorMessage={error?.message}
                        />
                      </FormItem>
                    )}
                  />

                  {selected.is_entity_verified && (
                    <div className="text-xs mt-2 text-gray-600">
                      {`*Hasil pengecekan awal: ${
                        selected.entity_bank || 'unknown'
                      } - ${selected.entity_name || 'unnamed'} - ${
                        selected.entity_account_number || 'N/A'
                      }`}
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      onClick={() => {
                        setIsOpenVerifModal(false)
                        reset()
                        setSelectedBank({ id: '', label: '' })
                        setSelected({} as ITransactionItem)
                        setStepVerify(1)
                      }}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Batal
                    </button>
                    <Button
                      variant="primary"
                      onClick={handleSubmit(handleUpdate)}
                      disabled={!selectedBank.id || !accountNo}
                    >
                      Cek
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {stepVerify === 2 && (
              <>
                <div className="text-sm mt-2">
                  Informasi rekening ditemukan:
                </div>
                <div className="text-sm mt-2">{`Institusi: ${result?.bank}`}</div>
                <div className="text-sm">{`Nomor Rekening: ${result?.account_number}`}</div>
                <div className="text-sm mb-2">{`Nama: ${result?.name}`}</div>

                <div className="text-sm">
                  Apa Anda ingin mengubah rekening tercatat?
                </div>

                {selected.is_entity_verified && (
                  <div className="text-xs mt-2 text-gray-600">
                    {`*Hasil pengecekan awal: ${
                      selected.entity_bank || 'unknown'
                    } - ${selected.entity_name || 'unnamed'} - ${
                      selected.entity_account_number || 'N/A'
                    }`}
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => {
                      setIsOpenVerifModal(false)
                      setSelected({} as ITransactionItem)
                      reset()
                      setSelectedBank({
                        id: '',
                        label: '',
                      })
                      setResult(
                        {} as {
                          name: string
                          account_number: string
                          bank: string
                        }
                      )
                      setStepVerify(1)
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <Button
                    variant="dark"
                    loading={isPending}
                    onClick={async () => {
                      mutate({
                        entity_name: result.name,
                        entity_account_number: result.account_number,
                        entity_bank: result.bank,
                      })
                    }}
                  >
                    Perbarui Info Lawan Transaksi
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </>
    </Modal>
  )
}

export default TransactionVerifyAccountModal
