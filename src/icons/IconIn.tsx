const IconIn = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5723 16.9497L7.05029 16.9498M7.05029 16.9498L7.05029 8.549M7.05029 16.9498L16.9498 7.05029"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default IconIn
