"use client"

import { useCallback } from "react"

export type EventType = 
  | "project_view"
  | "github_click"
  | "live_demo_click"
  | "demo_video_play"
  | "recruiter_visit"
  | "resume_download"
  | "ai_conversation"
  | "page_view"

export function useAnalytics() {
  const trackEvent = useCallback(async (event_type: EventType, project_id?: string, metadata?: any) => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type, project_id, metadata })
      })
    } catch (e) {
      console.error("Failed to track event", e)
    }
  }, [])

  return { trackEvent }
}
