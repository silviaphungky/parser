const IconPencil = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.0499 19.5514H20.0499M4.44995 19.5514L8.81594 18.6717C9.04771 18.625 9.26053 18.5109 9.42767 18.3437L19.2013 8.56461C19.6699 8.09576 19.6696 7.33577 19.2006 6.86731L17.1302 4.79923C16.6614 4.33097 15.9018 4.33129 15.4334 4.79995L5.65871 14.58C5.4919 14.7469 5.378 14.9593 5.33125 15.1906L4.44995 19.5514Z"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default IconPencil
