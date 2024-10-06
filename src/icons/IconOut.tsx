const IconOut = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.45802 7.0808L16.98 7.08068M16.98 7.08068L16.98 15.4815M16.98 7.08068L7.08052 16.9802"
      stroke={color || 'black'}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

export default IconOut
