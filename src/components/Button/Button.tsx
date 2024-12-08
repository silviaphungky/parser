import { IconLoading } from '@/icons'
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  forwardRef,
} from 'react'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: string | ReactNode
  variant: 'primary' | 'text' | 'primary-outline' | 'dark' | 'white-outline'
  loading?: boolean
  full?: boolean
}

const TYPE_MAPPING: {
  [key in
    | 'primary'
    | 'text'
    | 'primary-outline'
    | 'white-outline'
    | 'dark']: string
} = {
  'white-outline':
    'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100',
  primary:
    'bg-primary text-white font-semibold text-sm px-4 py-2 rounded-md hover:opacity-70 disabled:bg-red-400 disabled:hover:opacity-100',
  dark: 'bg-black text-white font-semibold text-sm px-4 py-2 rounded-md hover:opacity-70 disabled:bg-gray-700 disabled:hover:opacity-100',
  text: 'text-gray-600 px-4 py-2 text-sm',
  'primary-outline':
    'bg-white px-4 py-2 text-primary text-sm font-semibold rounded-md border border-gray-300 disabled:border-0 disabled:bg-gray-100',
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, variant, loading, full = false, ...props }, ref) => {
    return (
      <button
        {...props}
        className={
          TYPE_MAPPING[variant] +
          ` ${full ? 'w-full' : 'w-auto'}  ${
            loading ? 'flex justify-center gap-1 items-center opacity-70' : ''
          } ${props.disabled ? 'opacity-70' : ''}` +
          props.className
        }
        disabled={props.disabled || loading}
        ref={ref}
      >
        {children}
        {loading && (
          <div className="pt-2 flex gap-1 ml-1">
            <svg
              className="w-1 h-1 text-white animate-pulse delay-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="4" />
            </svg>

            <svg
              className="w-1 h-1 text-white animate-pulse delay-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="4" />
            </svg>
            <svg
              className="w-1 h-1 text-white animate-pulse delay-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="4" />
            </svg>
          </div>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
