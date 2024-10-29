import React from 'react'

interface FormItemProps {
  label?: string
  children: React.ReactNode
  errorMessage?: string
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  children,
  errorMessage,
}) => {
  return (
    <div className="form-item mb-2">
      {label && (
        <label className="form-label text-sm  font-semibold">{label}</label>
      )}
      <div className="form-control mt-1">{children}</div>
      {errorMessage && (
        <span className="error-message text-xs text-red-500">
          {errorMessage}
        </span>
      )}
    </div>
  )
}

export default FormItem
