import { useEffect, useState } from 'react'

// scrambles all elements with the specified attribute
export function useScrambler(attr: string, isActive: boolean) {
  const [tick, setTick] = useState<number>(0)

  // update `tick` every 50 ms when active
  useEffect(() => {
    if (!isActive) return

    let animationId: number
    let lastUpdateTime = 0

    const updateAnimation = (timestamp: number) => {
      if (timestamp - lastUpdateTime >= 50) {
        setTick((t) => t + 1)
        lastUpdateTime = timestamp
      }
      animationId = requestAnimationFrame(updateAnimation)
    }
    animationId = requestAnimationFrame(updateAnimation)

    return () => cancelAnimationFrame(animationId)
  }, [isActive])

  // scramble on each tick
  useEffect(() => {
    document.querySelectorAll(`[${attr}]`).forEach((element) => {
      element.textContent = generateRandomString(element.getAttribute(attr)?.length ?? 0)
    })
  }, [tick, attr])

  // restore original text when deactivating
  useEffect(() => {
    if (isActive) return

    document.querySelectorAll(`[${attr}]`).forEach((element) => {
      const originalText = element.getAttribute(attr)
      if (originalText) element.textContent = originalText
    })
  }, [isActive, attr])
}

// could be optimised, but rendering is the real bottleneck here
const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
const generateRandomString = (length: number) => {
  return Array.from({ length }, () =>
    characters.charAt((Math.random() * characters.length) | 0),
  ).join('')
}
