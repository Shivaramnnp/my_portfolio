import { createClient } from "@/lib/supabase/server"
import { ExternalLink, Download, Mail, Code, Link as LinkIcon, Briefcase, Award, GraduationCap } from "lucide-react"
import Link from "next/link"
import { getProxiedImageUrl } from "@/lib/utils"

export const metadata = {
  title: "Recruiter Mode | Shivaram Nunugonda",
  description: "One-page professional summary for recruiters.",
}

export default async function RecruiterModePage() {
  const supabase = await createClient()
  
  // Fetch data concurrently for speed
  const [
    { data: dbProfile, error: profileError },
    { data: skills, error: skillsError },
    { data: experiences, error: experiencesError },
    { data: education, error: educationError },
    { data: projects, error: projectsError },
    { data: certifications, error: certificationsError },
    { data: socialLinks, error: socialLinksError }
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('skills').select('*').order('level', { ascending: false }),
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('education').select('*').order('start_date', { ascending: false }),
    supabase.from('projects').select('*').eq('is_featured', true).order('sort_order', { ascending: true }),
    supabase.from('certifications').select('*').order('issue_date', { ascending: false }),
    supabase.from('social_links').select('*')
  ])


  // Resolve links dynamically using the database settings, fallback to defaults
  const githubLink = socialLinks?.find(link => link.platform.toLowerCase() === 'github')?.url || "https://github.com/Shivaramnnp/"
  const linkedinLink = socialLinks?.find(link => link.platform.toLowerCase() === 'linkedin')?.url || "https://linkedin.com/in/shivaram-nunugonda"

  const profile = dbProfile ? {
    ...dbProfile,
    github_url: githubLink,
    linkedin_url: linkedinLink
  } : {
    full_name: "Shivaram Nunugonda",
    title: "AI & ML Engineer · Android Developer",
    bio: "Building intelligent software solutions.",
    email: "shivaramnnp@gmail.com",
    avatar_url: null,
    github_url: githubLink,
    linkedin_url: linkedinLink
  }

  const defaultProjects = [
    {
      id: "default-proj-1",
      title: "ShivaOS",
      short_description: "A professional developer operating system with AI assistant, real-time tracking, and administrative dashboard built with Next.js and Supabase.",
      tech_stack: ["Next.js", "Supabase", "Tailwind CSS", "Framer Motion"],
      github_url: githubLink,
      live_url: "https://shivaram.dev"
    },
    {
      id: "default-proj-2",
      title: "HiDevs App",
      short_description: "A collaborative Android application designed to streamline internal communication and project tracking for developers using Jetpack Compose.",
      tech_stack: ["Android SDK", "Kotlin", "Jetpack Compose", "Coroutines"],
      github_url: githubLink,
      live_url: null
    }
  ]

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects

  const defaultCertifications = [
    {
      id: "default-cert-1",
      title: "Android Mobile Developer Certificate",
      issuer: "Google / Udacity",
      issue_date: "2025-05-15",
      credential_url: null,
      document_url: null
    },
    {
      id: "default-cert-2",
      title: "AI & Machine Learning Foundations",
      issuer: "Coursera / DeepLearning.AI",
      issue_date: "2025-08-20",
      credential_url: null,
      document_url: null
    }
  ]

  const displayCertifications = certifications && certifications.length > 0 ? certifications : defaultCertifications

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  // Combine experiences and education for timeline
  const timelineItems = [
    ...(experiences || []).map(exp => ({
      id: exp.id,
      title: exp.role,
      subtitle: `${exp.company} • ${formatDate(exp.start_date)}${exp.is_current ? ' - Present' : exp.end_date ? ` - ${formatDate(exp.end_date)}` : ''}`,
      description: exp.description || "",
      type: "experience"
    })),
    ...(education || []).map(edu => ({
      id: edu.id,
      title: edu.degree,
      subtitle: `${edu.institution} • ${formatDate(edu.start_date)}${edu.end_date ? ` - ${formatDate(edu.end_date)}` : ''}${edu.grade ? ` • Grade: ${edu.grade}` : ''}`,
      description: "",
      type: "education"
    }))
  ]

  const getYear = (subtitle: string) => {
    const matches = subtitle.match(/\b(19|20)\d{2}\b/)
    return matches ? parseInt(matches[0]) : 0
  }
  
  timelineItems.sort((a, b) => getYear(b.subtitle) - getYear(a.subtitle))
  const hasTimelineItems = timelineItems.length > 0

  // Group skills by category
  const groupedSkills = (skills || []).reduce((acc: Record<string, any[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const defaultGroupedSkills: Record<string, any[]> = {
    "Languages": [
      { id: "s1", name: "Kotlin" },
      { id: "s2", name: "Java" },
      { id: "s3", name: "Python" },
      { id: "s4", name: "JavaScript" },
      { id: "s5", name: "TypeScript" },
      { id: "s6", name: "SQL" },
      { id: "s7", name: "C" }
    ],
    "Mobile Dev": [
      { id: "s8", name: "Jetpack Compose" },
      { id: "s9", name: "MVVM Architecture" },
      { id: "s10", name: "Retrofit" },
      { id: "s11", name: "Coroutines" },
      { id: "s12", name: "Room Database" },
      { id: "s13", name: "Hilt/Dagger" }
    ],
    "Web Dev & Backend": [
      { id: "s14", name: "Next.js" },
      { id: "s15", name: "Supabase" },
      { id: "s16", name: "Firebase" },
      { id: "s17", name: "Vercel" }
    ],
    "AI & Machine Learning": [
      { id: "s18", name: "Google Gemini API" },
      { id: "s19", name: "Prompt Engineering" },
      { id: "s20", name: "LLMs (Large Language Models)" },
      { id: "s21", name: "RAG (Retrieval-Augmented Generation)" },
      { id: "s22", name: "TensorFlow" }
    ],
    "Tools & Others": [
      { id: "s23", name: "Git & GitHub" },
      { id: "s24", name: "Figma" }
    ]
  }

  const hasSkills = skills && skills.length > 0
  const displayGroupedSkills = hasSkills ? groupedSkills : defaultGroupedSkills

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Header Action Bar */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-2xl font-bold tracking-tight">Recruiter Summary</h1>
          <div className="flex gap-4">
            <Link 
              href="/resume" 
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow hover:bg-primary/90 transition-colors"
            >
              <Download size={16} /> Download PDF Resume
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-12">
          
          {/* Top Section: Profile */}
          <section className="flex flex-col md:flex-row gap-8 items-start border-b border-border pb-12">
            <div className="w-32 h-32 rounded-full bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
               {profile?.avatar_url ? (
                 <img src={getProxiedImageUrl(profile.avatar_url)} alt={profile?.full_name || "Shivaram"} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-4xl text-muted-foreground font-bold">
                   {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('') : "SN"}
                 </span>
               )}
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-extrabold mb-2">{profile?.full_name || "Shivaram Nunugonda"}</h2>
              <p className="text-xl text-primary font-medium mb-4">{profile?.title || "B.Tech CS (AI & ML) | Android Developer"}</p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {profile?.bio || "I am a driven software engineer with a deep passion for artificial intelligence, mobile development, and creating scalable systems. Bridging the gap between complex backend architectures and intuitive user interfaces."}
              </p>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <a href={`mailto:${profile?.email || "hello@shivaram.dev"}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={16} /> {profile?.email || "hello@shivaram.dev"}
                </a>
                {profile?.linkedin_url && (
                  <Link href={profile.linkedin_url} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <LinkIcon size={16} /> LinkedIn
                  </Link>
                )}
                {profile?.github_url && (
                  <Link href={profile.github_url} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Code size={16} /> GitHub
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Top Skills */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="text-primary" /> Core Competencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(displayGroupedSkills).map((category) => (
                <div key={category} className="border border-border/60 rounded-xl p-5 bg-muted/20 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {displayGroupedSkills[category].map((skill) => (
                      <span key={skill.id} className="bg-card text-foreground border border-border/50 text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-primary" /> Key Projects</h3>
            <div className="space-y-6">
              {displayProjects.map((project) => (
                <div key={project.id} className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold">{project.title}</h4>
                    <div className="flex gap-2">
                      {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer"><Code size={16} className="text-muted-foreground hover:text-foreground" /></a>}
                      {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer"><ExternalLink size={16} className="text-muted-foreground hover:text-foreground" /></a>}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{project.short_description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech: string) => (
                      <span key={tech} className="bg-muted px-2 py-1 rounded text-xs font-medium border border-border/50">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Experience */}
          <section>
             <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><GraduationCap className="text-primary" /> Experience & Education</h3>
             <div className="space-y-8 pl-4 border-l-2 border-primary/20">
                {hasTimelineItems ? (
                  timelineItems.map((item) => (
                    <div key={item.id} className="relative">
                      <div className={`absolute -left-[21px] top-1.5 w-4 h-4 rounded-full ${item.type === 'experience' ? 'bg-primary ring-4 ring-card' : 'bg-muted border-2 border-primary ring-4 ring-card'}`}></div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-primary font-medium text-sm mb-1">{item.subtitle}</p>
                      {item.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-card"></div>
                      <h4 className="text-lg font-bold">HiDevs Internship</h4>
                      <p className="text-primary font-medium text-sm mb-2">Android Developer • 2026</p>
                      <p className="text-muted-foreground text-sm">Developing native applications and working with modern Android architectures.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-primary ring-4 ring-card"></div>
                      <h4 className="text-lg font-bold">B.Tech Computer Science (AI & ML)</h4>
                      <p className="text-primary font-medium text-sm mb-2">Expected 2029</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-primary ring-4 ring-card"></div>
                      <h4 className="text-lg font-bold">Diploma in ECE</h4>
                      <p className="text-primary font-medium text-sm mb-2">Completed 2025 • 9.17 CGPA</p>
                    </div>
                  </>
                )}
             </div>
          </section>

          {/* Certifications */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="text-primary" /> Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayCertifications.map((cert) => (
                <div key={cert.id} className="border border-border rounded-lg p-5 hover:border-primary/50 transition-colors flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base">{cert.title}</h4>
                    <p className="text-sm text-primary font-medium">{cert.issuer}</p>
                    {cert.issue_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Issued: {formatDate(cert.issue_date)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {cert.credential_url && (
                      <a href={cert.credential_url} target="_blank" rel="noreferrer" title="Credential URL">
                        <ExternalLink size={16} className="text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                    {cert.document_url && (
                      <a href={cert.document_url} target="_blank" rel="noreferrer" title="Certificate Document">
                        <Download size={16} className="text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
