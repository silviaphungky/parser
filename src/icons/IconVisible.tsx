const IconVisible = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.6499 12.0294C14.6499 13.3192 13.5754 14.3647 12.2499 14.3647C10.9244 14.3647 9.8499 13.3192 9.8499 12.0294C9.8499 10.7396 10.9244 9.69402 12.2499 9.69402C13.5754 9.69402 14.6499 10.7396 14.6499 12.0294Z"
      stroke={color || 'black'}
      strokeWidth="2"
    />
  </svg>
)

export default IconVisible
