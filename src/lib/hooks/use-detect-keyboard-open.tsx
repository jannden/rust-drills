import { useEffect, useState } from 'react'

export default function useDetectKeyboardOpen() {
  const minKeyboardHeight = 300
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const listener = () => {
      if (window.visualViewport === null) return
      const newState = window.screen.height - minKeyboardHeight > window.visualViewport.height
      if (isKeyboardOpen != newState) {
        setIsKeyboardOpen(newState)
      }
    }
    if (typeof visualViewport != 'undefined' && window.visualViewport !== null) {
      window.visualViewport.addEventListener('resize', listener)
    }
    return () => {
      if (typeof visualViewport != 'undefined') {
        window.visualViewport?.removeEventListener('resize', listener)
      }
    }
  }, [isKeyboardOpen])

  return !!isKeyboardOpen
}
