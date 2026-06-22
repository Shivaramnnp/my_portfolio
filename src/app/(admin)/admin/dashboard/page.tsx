import { createClient } from "@/lib/supabase/server"
import { Users, FileDown, Eye, MessageSquare, Briefcase, MousePointerClick } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all events for MVP metric calculation (In production, use grouped queries or materialized views)
  const { data: events } = await supabase.from('analytics_events').select('*')
  const { data: projects } = await supabase.from('projects').select('id, title')

  const safeEvents = events || []
  
  const totalVisitors = safeEvents.filter(e => e.event_type === 'page_view').length
  const recruiterVisits = safeEvents.filter(e => e.event_type === 'recruiter_visit').length
  const resumeDownloads = safeEvents.filter(e => e.event_type === 'resume_download').length
  const aiConversations = safeEvents.filter(e => e.event_type === 'ai_conversation').length
  
  const projectViews = safeEvents.filter(e => e.event_type === 'project_view')
  const projectClicks = safeEvents.filter(e => ['github_click', 'live_demo_click', 'demo_video_play'].includes(e.event_type))

  // Find most viewed project
  const viewCounts = projectViews.reduce((acc: Record<string, number>, curr) => {
    if(curr.project_id) acc[curr.project_id] = (acc[curr.project_id] || 0) + 1
    return acc
  }, {})
  
  const mostViewedProjectId = Object.keys(viewCounts).sort((a,b) => viewCounts[b] - viewCounts[a])[0]
  const mostViewedProject = projects?.find(p => p.id === mostViewedProjectId)?.title || "--"

  // Find most clicked project
  const clickCounts = projectClicks.reduce((acc: Record<string, number>, curr) => {
    if(curr.project_id) acc[curr.project_id] = (acc[curr.project_id] || 0) + 1
    return acc
  }, {})
  
  const mostClickedProjectId = Object.keys(clickCounts).sort((a,b) => clickCounts[b] - clickCounts[a])[0]
  const mostClickedProject = projects?.find(p => p.id === mostClickedProjectId)?.title || "--"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* KPI: Total Visitors */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Users className="text-primary" />
            <h3 className="tracking-tight text-sm font-medium">Total Visitors</h3>
          </div>
          <div className="text-4xl font-bold">{totalVisitors}</div>
        </div>

        {/* KPI: Recruiter Visits */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Eye className="text-primary" />
            <h3 className="tracking-tight text-sm font-medium">Recruiter Visits</h3>
          </div>
          <div className="text-4xl font-bold">{recruiterVisits}</div>
        </div>

        {/* KPI: Resume Downloads */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <FileDown className="text-primary" />
            <h3 className="tracking-tight text-sm font-medium">Resume Downloads</h3>
          </div>
          <div className="text-4xl font-bold">{resumeDownloads}</div>
        </div>

        {/* KPI: AI Conversations */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <MessageSquare className="text-primary" />
            <h3 className="tracking-tight text-sm font-medium">AI Conversations</h3>
          </div>
          <div className="text-4xl font-bold">{aiConversations}</div>
        </div>

        {/* KPI: Most Viewed Project */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Briefcase className="text-primary" />
            <h3 className="tracking-tight text-sm font-medium">Most Viewed Project</h3>
          </div>
          <div className="text-xl font-bold line-clamp-2">{mostViewedProject}</div>
          <div className="text-sm text-muted-foreground mt-2">{viewCounts[mostViewedProjectId] || 0} views</div>
        </div>

        {/* KPI: Most Clicked Project */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <MousePointerClick className="text-primary" />
            <h3 className="tracking-tight text-sm font-medium">Most Clicked Project</h3>
          </div>
          <div className="text-xl font-bold line-clamp-2">{mostClickedProject}</div>
          <div className="text-sm text-muted-foreground mt-2">{clickCounts[mostClickedProjectId] || 0} interactions</div>
        </div>
      </div>
    </div>
  )
}
