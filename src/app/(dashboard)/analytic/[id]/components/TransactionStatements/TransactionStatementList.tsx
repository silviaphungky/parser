'use client'
import { Card, Pagination } from '@/components'
import { TransactionStatementsTable } from './components'
import { useState } from 'react'

const TransactionStatementList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)

  return (
    <div>
      <Card>
        <TransactionStatementsTable />
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

export default TransactionStatementList
