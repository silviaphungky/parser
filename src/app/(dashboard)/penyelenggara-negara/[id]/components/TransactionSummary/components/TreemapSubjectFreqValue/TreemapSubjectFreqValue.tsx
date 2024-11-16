'use client'
import { Card, Treemap } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { useState } from 'react'
import ReactSelect from 'react-select'

const mockTransactionType = [
  {
    id: 'in',
    label: 'Transaksi Masuk',
  },
  {
    id: 'out',
    label: 'Transaksi Keluar',
  },
]

const colorScale = {
  in: [
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
  out: [
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
  { id: 'transfer-bank', label: 'Transfer Bank' },
  { id: 'pembayaran-kartu', label: 'Pembayaran Kartu (Debit/Kredit)' },
  { id: 'dompet-digital', label: 'Dompet Digital' },
  { id: 'pembayaran-kode-qr', label: 'Pembayaran dengan Kode QR' },
  { id: 'transaksi-tunai', label: 'Transaksi Tunai (termasuk ATM)' },
  { id: 'tidak-diketahui', label: 'Tidak Diketahui (Unknown)' },
]

const TreemapSubjectFreqValue = ({
  data,
}: {
  data: {
    in: Array<Record<string, string | number | Array<{}>>>
    out: Array<Record<string, string | number | Array<{}>>>
  }
}) => {
  const [selectedType, setSelectedType] = useState<{
    id: string | number
    label: string
  }>(mockTransactionType[0])

  const handleChangeType = (option: { id: string | number; label: string }) => {
    setSelectedType(option)
  }

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
              />
            </div>
          </div>
        </div>
        <div>
          <Treemap
            data={data[selectedType.id as 'in' | 'out']}
            colorScale={
              colorScale[selectedType.id as 'in' | 'out'] as Array<string>
            }
            width={600}
            height={400}
          />
          <div className=" mt-8 mb-4 flex gap-4 justify-between">
            <div className="flex gap-1 items-end">
              <div className="text-xs">Frekuensi transaksi rendah</div>
              <div
                className={`w-[0.75rem] h-[0.75rem] `}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][0],
                }}
              />
              <div
                className={`w-[0.75rem] h-[0.75rem]`}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][1],
                }}
              />
              <div
                className={`w-[0.75rem] h-[0.75rem] `}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][2],
                }}
              />
              <div
                className={`w-[0.75rem] h-[0.75rem]`}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][3],
                }}
              />
              <div className="text-xs">Frekuensi transaksi tinggi</div>
            </div>

            <div className="flex gap-1 items-end">
              <div className="text-xs">Nominal transaksi rendah</div>
              <div
                className={`w-[0.75rem] h-[0.75rem] `}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][3],
                }}
              />
              <div
                className={`w-[0.9rem] h-[0.9rem] `}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][3],
                }}
              />
              <div
                className={`w-[1.1rem] h-[1.1rem] `}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][3],
                }}
              />
              <div
                className={`w-[1.25rem] h-[1.25rem] `}
                style={{
                  background: colorScale[selectedType.id as 'in' | 'out'][3],
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
