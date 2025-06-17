import { useState, useEffect } from 'react'

export const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    window.addEventListener('resize', onResize)

    setIsMobile(window.innerWidth < breakpoint)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [breakpoint])
  return isMobile
}
