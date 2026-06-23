import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Code, ExternalLink, PlayCircle, ArrowLeft, Terminal, LayoutDashboard, BrainCircuit, Rocket } from "lucide-react"
import Link from "next/link"

// In Next 15, params is a promise
export default async function ProjectCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!project) {
    notFound()
  }

  // Log project view event
  await supabase.from('analytics_events').insert({
    event_type: 'project_view',
    project_id: project.id
  })

  // Helper to render markdown-like content safely for MVP
  const renderText = (text: string | null) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
        {line}
      </p>
    ));
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative py-20 lg:py-32 border-b border-border bg-muted/20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 md:px-8 max-w-screen-xl">
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
            {project.short_description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background shadow transition-colors hover:bg-foreground/90">
                <Code className="mr-2 h-4 w-4" /> View Source
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </a>
            )}
            {project.demo_video_url && (
              <a href={project.demo_video_url} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary px-8 text-sm font-medium shadow-sm transition-colors hover:bg-primary/20">
                <PlayCircle className="mr-2 h-4 w-4" /> Watch Video
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 max-w-screen-xl py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: The Case Study */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Project Screenshot */}
          {project.image_url && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted/10 shadow-lg">
              <img 
                src={project.image_url} 
                alt={`${project.title} Screenshot`} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Problem Statement */}
          {project.problem_statement && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                  <BrainCircuit size={24} />
                </div>
                <h2 className="text-3xl font-bold">The Problem</h2>
              </div>
              <div className="prose prose-invert max-w-none text-lg">
                {renderText(project.problem_statement)}
              </div>
            </section>
          )}

          {/* Solution */}
          {project.solution && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Rocket size={24} />
                </div>
                <h2 className="text-3xl font-bold">The Solution</h2>
              </div>
              <div className="prose prose-invert max-w-none text-lg">
                {renderText(project.solution)}
              </div>
            </section>
          )}

          {/* Architecture */}
          {project.architecture && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <LayoutDashboard size={24} />
                </div>
                <h2 className="text-3xl font-bold">Architecture & Design</h2>
              </div>
              <div className="prose prose-invert max-w-none text-lg">
                {renderText(project.architecture)}
              </div>
            </section>
          )}

          {/* Challenges */}
          {project.challenges && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">Challenges Faced</h2>
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                {renderText(project.challenges)}
              </div>
            </section>
          )}

          {/* Lessons Learned */}
          {project.lessons_learned && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">Lessons Learned</h2>
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                {renderText(project.lessons_learned)}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Metadata & Stack */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={20} className="text-muted-foreground" />
                <h3 className="text-lg font-semibold">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(project.tech_stack as string[]).map((tech: string) => (
                  <span key={tech} className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Video Placeholder (if no direct embed yet) */}
          {project.demo_video_url && (
            <div className="bg-card border border-border rounded-xl p-6 overflow-hidden">
               <h3 className="text-lg font-semibold mb-4">Demo Presentation</h3>
               <a href={project.demo_video_url} target="_blank" rel="noreferrer" className="group relative block aspect-video w-full rounded-lg bg-muted overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors z-10">
                   <PlayCircle className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform" />
                 </div>
                 {/* In a real scenario, use next/image to show video thumbnail */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
               </a>
            </div>
          )}
        </div>

      </div>
    </article>
  )
}
