const IconLink = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.87851 10.1907L5.64505 12.4242C4.81092 13.2583 4.33124 14.3933 4.34001 15.5861C4.34877 16.7789 4.81796 17.9208 5.69167 18.7675C6.53836 19.6413 7.68048 20.1104 8.8731 20.1192C10.0929 20.1282 11.201 19.6755 12.0352 18.8414L14.2687 16.6079M17.1215 13.8097L19.3549 11.5762C20.1891 10.7421 20.6688 9.60711 20.66 8.4143C20.6512 7.22149 20.182 6.0796 19.3083 5.23287C18.4618 4.38638 17.3199 3.91717 16.1271 3.90841C14.9343 3.89964 13.7992 4.35209 12.965 5.18625L10.7315 7.4197M9.1131 15.3274L15.8135 8.62701"
      stroke={color || 'black'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default IconLink