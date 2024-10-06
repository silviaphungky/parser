import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

const Card = ({ children, className }: Props) => {
  return (
    <div className={`${className} bg-white rounded-lg shadow-md p-4`}>
      {children}
    </div>
  )
}

export default Card
