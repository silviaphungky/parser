import { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const Card = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={`${className} bg-white rounded-lg shadow-md p-4`}
      style={props.style}
    >
      {children}
    </div>
  )
}

export default Card
