import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const getPages = () => {
    const pages = []
    const maxButtons = 5
    const halfMax = Math.floor(maxButtons / 2)

    let start = Math.max(currentPage - halfMax, 1)
    let end = Math.min(start + maxButtons - 1, totalPages)

    if (totalPages <= maxButtons) {
      start = 1
      end = totalPages
    }

    if (end - start < maxButtons - 1) {
      start = Math.max(end - maxButtons + 1, 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center py-4 justify-between my-4">
      <p className="text-gray-600 text-xs">
        Showing{' '}
        <span className="font-bold">
          {startItem}-{endItem}
        </span>{' '}
        of <span className="font-bold">{totalItems}</span> items
      </p>

      <div className="flex items-center gap-6">
        {/* Size Changer */}
        <div className="flex items-center space-x-2 text-xs">
          <label htmlFor="itemsPerPage" className="text-gray-600">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            className="cursor-pointer py-2 rounded-lg focus:outline-none text-xs"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Prev Button (with arrow) */}
          <button
            className={`px-4 py-2 disabled:opacity-50 transition-all`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {getPages().map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded transition-all ${
                page === currentPage
                  ? 'bg-black text-white font-semibold'
                  : 'hover:text-white hover:bg-black hover:opacitity-90'
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {/* Next Button (with arrow) */}
          <button
            className={`px-4 py-2 rounded-lg disabled:opacity-50 transition-all`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
