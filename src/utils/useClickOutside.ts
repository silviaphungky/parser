import { useEffect, RefObject } from 'react'

function useOutsideClick(
  ref: RefObject<HTMLElement>,
  cb: (event: MouseEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const portal = document.getElementById('headlessui-portal-root')
      const isElementInsidePortal = portal?.contains(event.target as Node)

      const isInsidePortal = portal && isElementInsidePortal

      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!isInsidePortal || !portal)
      ) {
        cb(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, cb])
}

export default useOutsideClick
