const IconRefresh = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0002 19.3688C18.3915 17.9836 20.0002 15.3947 20.0002 12.4295C20.0002 9.06753 17.9321 6.18926 15.0002 5.00086M15.0002 16.9357V20.9412H19.0002M8.00024 5.57241C5.60904 6.95755 4.00024 9.54647 4.00024 12.5117C4.00024 15.8736 6.06841 18.7519 9.00024 19.9403M9.00024 8.00549L9.00024 4L5.00024 4"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default IconRefresh