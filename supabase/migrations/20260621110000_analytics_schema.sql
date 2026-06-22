-- Create analytics_events table
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL, -- e.g., 'project_view', 'github_click', 'live_demo_click', 'demo_video_play', 'recruiter_visit', 'resume_download', 'ai_conversation'
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- Optional, only if event is related to a project
    metadata JSONB, -- Any extra data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
CREATE POLICY "Allow public insert to analytics_events" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to read analytics
CREATE POLICY "Allow authenticated read analytics_events" ON analytics_events
    FOR SELECT USING (auth.role() = 'authenticated');
