import { FormItem, Input, Modal } from '@/components'
import { ITransactionItem } from '../../TransactionList'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import InputDropdown from '@/components/InputDropdown'
import { bankOptions } from '../TransactionBankDestModal/TransactionBankDestModal'

const validationSchema = yup.object().shape({
  accountNo: yup.string(),
})

const TransactionVerifyAccountModal = ({
  selected,
  verifyBankAccount,
  isOpen,
  setIsOpenVerifModal,
  refetch,
  setSelected,
}: {
  isOpen: boolean
  selected: ITransactionItem
  verifyBankAccount: ({
    transaction_id,
  }: {
    transaction_id: string
  }) => Promise<{ isSuccess: boolean; error?: string; data?: any }>
  setIsOpenVerifModal: Dispatch<SetStateAction<boolean>>
  refetch: () => void
  setSelected: Dispatch<SetStateAction<ITransactionItem>>
}) => {
  const [selectedBank, setSelectedBank] = useState({ id: '', label: '' })
  const [stepVerify, setStepVerify] = useState(1)
  const [result, setResult] = useState(
    {} as {
      name: string
      account_no: string
      bank: string
    }
  )

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      accountNo: '',
    },
    resolver: yupResolver(validationSchema),
  })

  const handleUpdate = async () => {
    const { isSuccess, error, data } = await verifyBankAccount({
      transaction_id: selected.transaction_id,
    })

    if (isSuccess) {
      toast.success('Berhasil mengecek info rekening transaksi')
      setResult(data)
      setStepVerify(2)
    } else {
      setStepVerify(3)
      toast.error(`Gagal mengecek info rekening transaksi: ${error}`)
      setIsOpenVerifModal(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpenVerifModal(false)}>
      <>
        <h2 className="font-semibold text-lg">
          Konfirmasi Pengecekan Rekening
        </h2>
        {selected.is_entity_verified && (
          <>
            <div className="mt-2 text-sm">
              Transaksi ini telah dilakukan pengecekan sebelumnya dengan
              informasi:
            </div>
            <div className="text-sm mt-2">Institusi: BCA</div>
            <div className="text-sm">Nomor Rekening: 13531853</div>
            <div className="text-sm">Nama: Ilham</div>
            <div className="text-sm mt-2">
              Apakah Anda ingin tetap melakukan pengecekan ulang?
            </div>

            <div className="text-xs mt-2 text-gray-600">
              {`*Info lawan transaksi awal: ${
                selected.entity_bank || 'unknown'
              } - ${selected.entity_name || 'unnamed'} - ${
                selected.entity_account_number || 'N/A'
              }`}
            </div>
          </>
        )}
        {!selected.is_entity_verified && (
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

                  {selectedBank.id === 'other' && (
                    <FormItem label="Bank">
                      <Input
                        className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        onChange={() => {}}
                        placeholder="Masukkan bank..."
                      />
                    </FormItem>
                  )}

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

                  <div className="text-xs mt-2 text-gray-600">
                    {`*Info lawan transaksi awal: ${
                      selected.entity_bank || 'unknown'
                    } - ${selected.entity_name || 'unnamed'} - ${
                      selected.entity_account_number || 'N/A'
                    }`}
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      onClick={() => {
                        setIsOpenVerifModal(false)
                        reset()
                        setSelected({} as ITransactionItem)
                      }}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Batal
                    </button>
                    <Button
                      variant="primary"
                      onClick={handleSubmit(handleUpdate)}
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
                <div className="text-sm">{`Nomor Rekening: ${result?.account_no}`}</div>
                <div className="text-sm">{`Nama: ${result?.name}`}</div>

                <div className="text-xs mt-2 text-gray-600">
                  {`*Info lawan transaksi awal: ${
                    selected.entity_bank || 'unknown'
                  } - ${selected.entity_name || 'unnamed'} - ${
                    selected.entity_account_number || 'N/A'
                  }`}
                </div>

                <div className="text-sm">
                  Apakah Anda ingin memperbarui info lawan transaksi?
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => {
                      setIsOpenVerifModal(false)
                      setSelected({} as ITransactionItem)
                      reset()
                      setResult(
                        {} as {
                          name: string
                          account_no: string
                          bank: string
                        }
                      )
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <Button
                    variant="dark"
                    onClick={async () => {
                      //TODO: PATCH TO BE UPDATE DATA
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
