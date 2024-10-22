const IconSort = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 16}
    height={size || 16}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill={color || '#333939'}
      fill-rule="evenodd"
      d="M9.95 14.707l-1.122 1.121V6a1 1 0 10-2 0v9.829l-1.12-1.122a1 1 0 00-1.415 1.414L7.12 18.95a1 1 0 001.415 0l.001-.002 2.827-2.827a1 1 0 00-1.414-1.414zm4.757-5.171l1.121-1.122v9.829a1 1 0 002 0V8.414l1.122 1.122a1 1 0 101.414-1.415l-2.829-2.828a1 1 0 00-1.414 0l-.002.002-2.826 2.826a1 1 0 001.414 1.415z"
      clipRule="evenodd"
    ></path>
  </svg>
)

export default IconSort
