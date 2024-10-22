const IconX = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.75 6L6.75 18M18.75 18L6.75 6"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default IconX
