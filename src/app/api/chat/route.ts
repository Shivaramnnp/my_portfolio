import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Connect to Supabase to fetch context for RAG
  const supabase = await createClient()
  
  // In MVP, we fetch everything. In production, use pgvector for semantic search.
  const [
    { data: profile },
    { data: skills },
    { data: projects },
    { data: experiences }
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, bio, title').limit(1).single(),
    supabase.from('skills').select('name, category'),
    supabase.from('projects').select('title, short_description, tech_stack').eq('is_featured', true),
    supabase.from('experiences').select('company, role, start_date')
  ])

  // Build the system prompt with live database data
  const systemPrompt = `You are the personal AI assistant for ${profile?.full_name || 'Shivaram Nunugonda'}, representing them on their professional portfolio (ShivaOS).
Your goal is to answer questions from recruiters and visitors about Shivaram's skills, projects, and experience accurately and professionally.

Here is the most up-to-date information directly from Shivaram's database:

[PROFILE]
Name: ${profile?.full_name || 'Shivaram'}
Title: ${profile?.title || 'B.Tech CS (AI & ML) | Android Developer'}
Bio: ${profile?.bio || 'Building intelligent software solutions.'}

[SKILLS]
${skills?.map(s => `- ${s.name} (${s.category})`).join('\n') || 'Android, Next.js, AI/ML, Supabase'}

[FEATURED PROJECTS]
${projects?.map(p => `- ${p.title}: ${p.short_description}. Stack: ${p.tech_stack?.join(', ')}`).join('\n') || 'Intelligent Resume Analyzer, Water Tracker App'}

[EXPERIENCE]
${experiences?.map(e => `- ${e.role} at ${e.company} (Started: ${e.start_date})`).join('\n') || 'HiDevs Internship (Android Developer)'}

Rules:
1. Speak in the first person ("I am Shivaram's AI Assistant...") or third person ("Shivaram is..."). Do not pretend to be Shivaram directly.
2. If asked something outside the provided context, politely explain you only have information regarding their professional portfolio.
3. Be concise, polite, and enthusiastic.
4. Format responses using Markdown (bullet points, bold text).`

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
