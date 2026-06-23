"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAnalytics } from "@/hooks/use-analytics"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { trackEvent } = useAnalytics()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    // Prevent double tracking in React 19 Strict Mode
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname

    // 1. Track page view
    trackEvent("page_view", undefined, { path: pathname })

    // 2. Track recruiter page visit
    if (pathname === "/recruiter") {
      trackEvent("recruiter_visit")
    }
  }, [pathname, trackEvent])

  return null
}
