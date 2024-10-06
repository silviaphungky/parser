import { FC } from 'react'

/* eslint-disable max-len */
interface Props {
  width?: number
  height?: number
  color?: string
}

const IconArrowRight: FC<Props> = ({
  width = 10,
  height = 16,
  color = '#707070',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07576 15.7297L9.22727 8.6408C9.59091 8.28035 9.59091 7.71965 9.22727 7.3592L2.07576 0.270337C1.71212 -0.0901134 1.14647 -0.0901135 0.782829 0.270337C0.621213 0.430537 0.500002 0.670838 0.500002 0.911138C0.500002 1.15144 0.580809 1.39174 0.782829 1.55194L7.28788 8L0.782828 14.4481C0.621212 14.6083 0.5 14.8486 0.5 15.0889C0.5 15.3292 0.580808 15.5695 0.782828 15.7297C1.14646 16.0901 1.71212 16.0901 2.07576 15.7297Z"
        fill={color}
      />
    </svg>
  )
}

export default IconArrowRight
