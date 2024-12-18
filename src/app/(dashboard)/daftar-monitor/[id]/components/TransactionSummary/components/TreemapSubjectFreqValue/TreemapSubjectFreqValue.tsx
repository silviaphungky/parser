'use client'
import { Card, Shimmer, Treemap } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { API_URL } from '@/constants/apiUrl'
import axiosInstance from '@/utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import ReactSelect, { MultiValue } from 'react-select'

const mockTransactionType = [
  {
    id: 'IN',
    label: 'Transaksi Masuk',
  },
  {
    id: 'OUT',
    label: 'Transaksi Keluar',
  },
]

const colorScale = {
  IN: [
    'rgb(168, 230, 207, 0.7)',
    'rgb(112, 193, 179, 0.7)',
    'rgb(69, 162, 158, 0.7)',
    'rgb(55, 150, 131, 0.7)',
    'rgb(46, 133, 110, 0.7)',
    'rgb(38, 107, 91, 0.7)',
    'rgb(29, 81, 72, 0.7)',
    'rgb(19, 68, 52, 0.7)',
    'rgb(11, 48, 38, 0.7)',
  ],
  OUT: [
    'rgba(246, 164, 164, 0.7)',
    'rgba(255, 153, 153, 0.7)',
    'rgba(255, 102, 102, 0.7)',
    'rgba(255, 77, 77, 0.7)',
    'rgba(255, 51, 51, 0.7)',
    'rgba(204, 41, 41, 0.7)',
    'rgba(153, 31, 31, 0.7)',
    'rgba(122, 35, 35, 0.7)',
    'rgba(115, 36, 36, 0.7)',
  ],
}

export const mockTransactionMethod = [
  { value: 'TRANSFER BANK', label: 'Transfer Bank' },
  {
    value: 'PEMBAYARAN KARTU (DEBIT/KREDIT)',
    label: 'Pembayaran Kartu (Debit/Kredit)',
  },
  { value: 'DOMPET DIGITAL', label: 'Dompet Digital' },
  { value: 'PEMBAYARAN DENGAN KODE QR', label: 'Pembayaran dengan Kode QR' },
  {
    value: 'TRANSAKSI TUNAI (TERMASUK ATM)',
    label: 'Transaksi Tunai (termasuk ATM)',
  },
  {
    value: 'KREDIT BANK',
    label: 'Kredit Bank',
  },
  {
    value: 'DEBET BANK',
    label: 'Debit Bank',
  },
  { value: 'TIDAK DIKETAHUI (UNKNOWN)', label: 'Tidak Diketahui (Unknown)' },
]

const TreemapSubjectFreqValue = ({
  baseUrl,
  selectedCurrency,
  selectedDate,
  token,
  selectedBank,
}: {
  baseUrl: string
  selectedCurrency: {
    id: string | number
    label: string
  }
  selectedDate: {
    from: Date | undefined
    to: Date | undefined
  }
  token: string
  selectedBank: MultiValue<{ value: string; label: string }>
}) => {
  const { id } = useParams()
  const [selectedType, setSelectedType] = useState<{
    id: string | number
    label: string
  }>(mockTransactionType[0])
  const [selectedTransactionMethod, setSelectedTransactionMethod] = useState<
    MultiValue<{ value: string; label: string }>
  >([])

  const handleChangeType = (option: { id: string | number; label: string }) => {
    setSelectedType(option)
  }

  const transactionMethodPayload = selectedTransactionMethod.map((item) => {
    return item.value
  })

  const {
    data: treemapData,
    isLoading,
    isFetching,
  } = useQuery<{
    summary_frequency: Array<{
      entity_account_number: string
      entity_bank: string
      entity_name: string
      total_amount: number
      total_transaction: number
    }>
  }>({
    queryKey: [
      'treemapData',
      selectedDate.from,
      selectedDate.to,
      selectedCurrency.id,
      selectedType.id,
      transactionMethodPayload,
      id,
      selectedBank,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${baseUrl}/${API_URL.TOP_TRANSACTION}/${id}/summary/frequency`,
        {
          params: {
            start_period: selectedDate.from
              ? dayjs(selectedDate.from).format('YYYY-MM-DD')
              : undefined,
            end_period: selectedDate.to
              ? dayjs(selectedDate.to).format('YYYY-MM-DD')
              : undefined,
            currency: selectedCurrency.id,
            direction: selectedType.id,
            transaction_method: [...transactionMethodPayload],
            account_number: selectedBank.map((item) => item.value),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = response.data
      return data.data
    },
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mb-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            Pengelompokan berdasarkan{' '}
            <strong className="font-semibold">Lawan Transaksi</strong>
          </div>
          <div className="flex gap-4">
            <div className="w-[10rem]">
              <InputDropdown
                options={mockTransactionType}
                value={selectedType}
                onChange={handleChangeType}
              />
            </div>
            <div className="w-[20rem]">
              <ReactSelect
                isMulti
                value={selectedTransactionMethod}
                name="colors"
                options={mockTransactionMethod}
                className="react-select-container"
                placeholder="Pilih metode transaksi"
                styles={{
                  option: (styles, state) => ({
                    ...styles,
                    backgroundColor: state.isSelected ? '#E6EFF5' : '',
                    '&:hover': {
                      // overriding hover
                      ...styles, // apply initial styles
                      backgroundColor: '#E6EFF5',
                    },
                  }),
                  indicatorsContainer: (base, props) => {
                    return {
                      ...base,
                      alignItems: 'start',
                    }
                  },
                  clearIndicator: (base) => {
                    return {
                      ...base,
                      cursor: 'pointer',
                    }
                  },
                  dropdownIndicator: (base) => {
                    return {
                      ...base,
                      cursor: 'pointer',
                    }
                  },
                  control: (baseStyles, state) => {
                    return {
                      ...baseStyles,
                      borderColor: 'rgb(209, 213, 219)',
                      boxShadow: 'none',
                      borderRadius: '0.375rem',
                      height: '34px',
                      overflow: 'auto',
                    }
                  },
                }}
                onChange={(props) => setSelectedTransactionMethod(props)}
              />
            </div>
          </div>
        </div>

        <div>
          {(isLoading || isFetching) && <Shimmer />}
          {!isLoading && !isFetching && (
            <>
              <Treemap
                data={
                  treemapData?.summary_frequency
                    .map((item) => ({
                      ...item,
                      size: Math.pow(item.total_amount, 0.5),
                      frequency: item.total_transaction,
                    }))
                    .sort((a, b) => b.total_amount - a.total_amount) || []
                }
                colorScale={
                  colorScale[selectedType.id as 'IN' | 'OUT'] as Array<string>
                }
                height={400}
                width={400}
              />
            </>
          )}
          <div className=" mt-8 mb-4 flex gap-4 justify-between">
            <div className="flex gap-1 items-end">
              <div className="text-xs">Frekuensi transaksi rendah</div>
              <div
                className={`w-[0.75rem] h-[0.75rem] `}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][0],
                }}
              />
              <div
                className={`w-[0.75rem] h-[0.75rem]`}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][1],
                }}
              />
              <div
                className={`w-[0.75rem] h-[0.75rem] `}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][2],
                }}
              />
              <div
                className={`w-[0.75rem] h-[0.75rem]`}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][3],
                }}
              />
              <div className="text-xs">Frekuensi transaksi tinggi</div>
            </div>

            <div className="flex gap-1 items-end">
              <div className="text-xs">Nominal transaksi rendah</div>
              <div
                className={`w-[0.75rem] h-[0.75rem] `}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][3],
                }}
              />
              <div
                className={`w-[0.9rem] h-[0.9rem] `}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][3],
                }}
              />
              <div
                className={`w-[1.1rem] h-[1.1rem] `}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][3],
                }}
              />
              <div
                className={`w-[1.25rem] h-[1.25rem] `}
                style={{
                  background: colorScale[selectedType.id as 'IN' | 'OUT'][3],
                }}
              />
              <div className="text-xs">Nominal transaksi tinggi</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TreemapSubjectFreqValue
