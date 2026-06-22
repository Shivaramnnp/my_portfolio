import { Hero } from "@/components/public/hero"
import { ProjectGrid } from "@/components/public/project-grid"
import { SkillsStrip } from "@/components/public/skills-strip"
import { Timeline } from "@/components/public/timeline"
import { RecruiterCTA } from "@/components/public/recruiter-cta"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: profile },
    { data: projectsData },
    { data: skillsData },
    { data: experiencesData },
    { data: educationData },
    { data: certificationsData },
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .limit(6),
    supabase.from('skills').select('*').order('level', { ascending: false }),
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('education').select('*').order('start_date', { ascending: false }),
    supabase.from('certifications').select('*').order('issue_date', { ascending: false }),
  ])

  const projects = projectsData || []
  const skills = skillsData || []
  const experiences = experiencesData || []
  const education = educationData || []
  const certifications = certificationsData || []

  return (
    <div className="flex flex-col">
      {/* 1. Personal hero — name, title, availability, CTAs */}
      <Hero profile={profile} />

      {/* 2. Tech skills strip — compact, scannable cards */}
      <SkillsStrip skills={skills} />

      {/* 3. Featured projects — real work, not empty space */}
      {projects.length > 0 ? (
        <ProjectGrid
          projects={projects}
          title="Featured Projects"
          description="Engineering case studies from AI systems, Android apps, and full-stack platforms."
        />
      ) : (
        <section id="projects" className="py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Featured Projects</h2>
            <p className="text-muted-foreground text-lg">
              Projects are being added to the CMS. Check back soon or visit the{" "}
              <a href="/admin/dashboard" className="text-primary underline underline-offset-4">Admin Dashboard</a>{" "}
              to add your first project.
            </p>
          </div>
        </section>
      )}

      {/* 4. Timeline — career milestones, visual storytelling */}
      <Timeline 
        experiences={experiences} 
        education={education} 
        certifications={certifications} 
      />

      {/* 5. Recruiter CTA — clear action for hiring managers */}
      <RecruiterCTA />
    </div>
  )
}
