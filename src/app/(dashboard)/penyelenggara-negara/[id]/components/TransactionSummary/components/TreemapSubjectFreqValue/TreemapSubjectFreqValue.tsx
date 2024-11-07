'use client'
import { Card, Treemap } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { useState } from 'react'

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
            Pengelompokan berdasarkan <strong>Lawan Transaksi</strong>
          </div>
          <div className="w-[10rem]">
            <InputDropdown
              options={mockTransactionType}
              value={selectedType}
              onChange={handleChangeType}
            />
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
              <div className={`w-[0.75rem] h-[0.75rem] bg-gray-100`} />
              <div className={`w-[0.75rem] h-[0.75rem] bg-gray-200`} />
              <div className={`w-[0.75rem] h-[0.75rem] bg-gray-300`} />
              <div className={`w-[0.75rem] h-[0.75rem] bg-gray-400`} />
              <div className="text-xs">Frekuensi transaksi tinggi</div>
            </div>

            <div className="flex gap-1 items-end">
              <div className="text-xs">Nominal transaksi rendah</div>
              <div className={`w-[0.75rem] h-[0.75rem] bg-gray-300`} />
              <div className={`w-[0.9rem] h-[0.9rem] bg-gray-300`} />
              <div className={`w-[1.1rem] h-[1.1rem] bg-gray-300`} />
              <div className={`w-[1.25rem] h-[1.25rem] bg-gray-300`} />
              <div className="text-xs">Nominal transaksi tinggi</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TreemapSubjectFreqValue
