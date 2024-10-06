import { FC } from 'react'

/* eslint-disable max-len */
interface Props {
  width?: number
  height?: number
  color?: string
}

const IconArrowLeft: FC<Props> = ({
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
        d="M7.92424 0.270336L0.772728 7.3592C0.409092 7.71965 0.409092 8.28035 0.772728 8.6408L7.92424 15.7297C8.28788 16.0901 8.85353 16.0901 9.21717 15.7297C9.37879 15.5695 9.5 15.3292 9.5 15.0889C9.5 14.8486 9.41919 14.6083 9.21717 14.4481L2.71212 8L9.21717 1.55194C9.37879 1.39174 9.5 1.15144 9.5 0.911137C9.5 0.670837 9.41919 0.430536 9.21717 0.270336C8.85354 -0.0901135 8.28788 -0.0901136 7.92424 0.270336Z"
        fill={color}
      />
    </svg>
  )
}

export default IconArrowLeft
