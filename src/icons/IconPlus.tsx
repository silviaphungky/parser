const IconPlus = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 6L12.5 18M18.5 12L6.5 12"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default IconPlus
