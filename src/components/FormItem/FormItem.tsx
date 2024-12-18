import React from 'react'

interface FormItemProps {
  label?: string
  children: React.ReactNode
  errorMessage?: string
  required?: boolean
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  children,
  errorMessage,
  required,
}) => {
  return (
    <div className="form-item mb-2">
      {label && (
        <label className="form-label text-sm  font-semibold flex gap-1">
          <div>{label}</div>
          {required && <div className="text-red-500">*</div>}
        </label>
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
