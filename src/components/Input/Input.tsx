import React, { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: string
  errorMessage?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', errorMessage, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`border rounded-lg px-4 py-2 focus:outline-none focus:none ${className} ${
          errorMessage ? 'border-red-500' : ''
        }`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
