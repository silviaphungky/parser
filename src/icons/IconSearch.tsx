const IconSearch = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.427 17.0401L20.9001 20.4001M11.9001 7.2001C13.8883 7.2001 15.5001 8.81187 15.5001 10.8001M19.7801 11.4401C19.7801 15.77 16.27 19.2801 11.9401 19.2801C7.61018 19.2801 4.1001 15.77 4.1001 11.4401C4.1001 7.11018 7.61018 3.6001 11.9401 3.6001C16.27 3.6001 19.7801 7.11018 19.7801 11.4401Z"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default IconSearch
