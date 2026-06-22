import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { event_type, project_id, metadata } = await req.json()
    const supabase = await createClient()

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        project_id: project_id || null,
        metadata: metadata || {}
      })

    if (error) {
      console.error("Analytics Error:", error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
