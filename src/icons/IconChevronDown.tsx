const IconChevronDown = ({
  size,
  color,
}: {
  size?: number
  color?: string
}) => {
  return (
    <svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.23431 5.83432C4.54673 5.5219 5.05326 5.5219 5.36568 5.83432L7.99999 8.46864L10.6343 5.83432C10.9467 5.5219 11.4533 5.5219 11.7657 5.83432C12.0781 6.14674 12.0781 6.65327 11.7657 6.96569L8.56568 10.1657C8.25326 10.4781 7.74673 10.4781 7.43431 10.1657L4.23431 6.96569C3.9219 6.65327 3.9219 6.14674 4.23431 5.83432Z"
        fill={color || '#111827'}
      />
    </svg>
  )
}

export default IconChevronDown
