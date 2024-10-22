const IconUpload = ({ size, color }: { size?: number; color?: string }) => {
  return (
    <svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.75 15.2044V18.8925C4.75 19.4514 4.96071 19.9875 5.33579 20.3827C5.71086 20.778 6.21957 21 6.75 21H18.75C19.2804 21 19.7891 20.778 20.1642 20.3827C20.5393 19.9875 20.75 19.4514 20.75 18.8925V15.2044M12.7507 14.9425L12.7507 3M12.7507 3L8.17931 7.56318M12.7507 3L17.3222 7.56318"
        stroke={color || 'black'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconUpload
