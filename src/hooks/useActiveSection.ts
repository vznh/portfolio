// Made this shit through v0.
"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface SectionData {
  element: HTMLDivElement
  ratio: number
}

export function useActiveSection(initialDelay = 3000) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const sectionsRef = useRef<{ [key: string]: SectionData }>({})

  // Enable after initial animations complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEnabled(true)
    }, initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  // Register a section with the hook
  const registerSection = useCallback((sectionId: string) => {
    return (element: HTMLDivElement | null) => {
      if (element) {
        sectionsRef.current[sectionId] = { element, ratio: 0 }
      } else {
        delete sectionsRef.current[sectionId]
      }
    }
  }, [])

  // Get opacity for a specific section
  const getOpacity = useCallback(
    (sectionId: string, activeOpacity = 1, inactiveOpacity = 0.3) => {
      if (!isEnabled) return undefined // Let initial animations handle opacity
      return activeSection === sectionId ? activeOpacity : inactiveOpacity
    },
    [activeSection, isEnabled],
  )

  // Add this new function to get transition config
  const getTransition = useCallback(
    (originalTransition: any) => {
      if (!isEnabled) return originalTransition // Use original transition during initial animations
      return { duration: 0.3 } // Instant transitions for scroll-based changes
    },
    [isEnabled],
  )

  useEffect(() => {
    if (!isEnabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Update intersection ratios
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section")
          if (sectionId && sectionsRef.current[sectionId]) {
            sectionsRef.current[sectionId].ratio = entry.intersectionRatio
          }
        })

        // Find section with highest intersection ratio
        let maxRatio = 0
        let mostVisibleSection = null

        Object.entries(sectionsRef.current).forEach(([sectionId, data]) => {
          if (data.ratio > maxRatio) {
            maxRatio = data.ratio
            mostVisibleSection = sectionId
          }
        })

        setActiveSection(mostVisibleSection)
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    // Observe all registered sections
    Object.values(sectionsRef.current).forEach(({ element }) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [isEnabled])

  return { registerSection, getOpacity, getTransition, activeSection, isEnabled }
}
