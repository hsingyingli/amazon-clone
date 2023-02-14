import { useEffect, useState } from "react"

const useBreakpoint = () => {

  const getBreakpoint = () => {
    const width = window.innerWidth

    if (width >= 1536) {
      return "2xl"
    } else if (width >= 1280) {
      return "xl"
    } else if (width >= 1024) {
      return "lg"
    } else if (width >= 768) {
      return "md"
    }
    return "sm"
  }

  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint())
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}

export {
  useBreakpoint
}
