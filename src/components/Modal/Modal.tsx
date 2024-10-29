import { IconX } from '@/icons'
import React from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  closeable?: boolean
  width?: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  closeable = true,
  width = 'max-w-lg', // Default width
  children,
}) => {
  if (!isOpen) return null

  const handleClose = () => {
    if (closeable) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
      <div className={` bg-white rounded-lg shadow-lg w-full ${width} p-6`}>
        {closeable && (
          <div onClick={handleClose} className="cursor-pointer float-right">
            <IconX size={18} />
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
