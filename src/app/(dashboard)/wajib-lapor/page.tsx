'use client'
import { Card, Modal, Pagination, Title } from '@/components'
import PNTable from './components/PNTable'
import { IconPlus } from '@/icons'
import { WajibLaporCreate } from './components'
import { useState } from 'react'

const PNPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  return (
    <div>
      <Modal
        width="max-w-[30rem]"
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      >
        <WajibLaporCreate />
      </Modal>
      <div className="flex justify-between">
        <Title title="Wajib Lapor" />
        <button
          className="flex gap-2 bg-primary text-white items-center p-2 pr-3 rounded-md text-sm hover:opacity-95"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <IconPlus color="#fff" size={18} />
          New Wajib Lapor
        </button>
      </div>
      <Card className="w-full mt-6">
        <PNTable />
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          totalItems={100}
          itemsPerPage={5}
          onItemsPerPageChange={setItemPerPage}
        />
      </Card>
    </div>
  )
}

export default PNPage
