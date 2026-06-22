import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Mail, Code, Link as LinkIcon, ExternalLink, Printer } from "lucide-react"
import { PrintButton } from "@/components/public/print-button"

export default async function ResumeVariantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let variant = null
  if (id !== "default") {
    const { data } = await supabase.from('resume_variants').select('*').eq('id', id).single()
    variant = data
  }

  if (!variant) {
    variant = {
      id: "default",
      title: "Shivaram Nunugonda - Resume",
      template_type: "portfolio",
      is_public_default: true
    }
  }

  // For MVP, we fetch all data. In a full implementation, we'd join with the selection tables.
  const [
    { data: dbProfile },
    { data: skills },
    { data: experiences },
    { data: education },
    { data: certifications },
    { data: projects },
    { data: socialLinks }
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('skills').select('*'),
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('education').select('*').order('start_date', { ascending: false }),
    supabase.from('certifications').select('*').order('issue_date', { ascending: false }),
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    supabase.from('social_links').select('*')
  ])

  // Resolve links dynamically using the database settings, fallback to user's updated GitHub handle
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

  // Split skills by category for better formatting
  const groupedSkills = skills?.reduce((acc: any, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill.name)
    return acc
  }, {})

  // Fallback to default mock data if database tables are empty
  const displayExperiences = experiences && experiences.length > 0 ? experiences : [
    {
      id: "default-exp-1",
      role: "Android Developer Intern",
      company: "HiDevs",
      start_date: "2026",
      is_current: false
    }
  ]

  const displayEducation = education && education.length > 0 ? education : [
    {
      id: "default-edu-1",
      degree: "B.Tech Computer Science (AI & ML)",
      institution: "Your University",
      start_date: "Expected 2029"
    },
    {
      id: "default-edu-2",
      degree: "Diploma in ECE",
      institution: "Your Institution",
      start_date: "Completed 2025"
    }
  ]

  const displayCertifications = certifications && certifications.length > 0 ? certifications : [
    {
      id: "default-cert-1",
      title: "Android Mobile Developer Certificate",
      issuer: "Google / Udacity"
    },
    {
      id: "default-cert-2",
      title: "AI & Machine Learning Foundations",
      issuer: "Coursera / DeepLearning.AI"
    }
  ]

  const displayProjects = projects && projects.length > 0 ? projects : [
    {
      id: "default-proj-1",
      title: "ShivaOS",
      short_description: "A professional developer operating system with AI assistant, real-time tracking, and administrative dashboard built with Next.js and Supabase.",
      tech_stack: ["Next.js", "Supabase", "Tailwind CSS", "Framer Motion"]
    },
    {
      id: "default-proj-2",
      title: "HiDevs App",
      short_description: "A collaborative Android application designed to streamline internal communication and project tracking for developers using Jetpack Compose.",
      tech_stack: ["Android SDK", "Kotlin", "Jetpack Compose", "Coroutines"]
    }
  ]

  const displayGroupedSkills = (skills && skills.length > 0) ? groupedSkills : {
    "Languages": ["Kotlin", "Java", "Python", "JavaScript", "TypeScript", "SQL"],
    "Mobile Dev": ["Android SDK", "Jetpack Compose", "XML UI", "Coroutines", "Retrofit"],
    "Web Dev": ["React", "Next.js", "Tailwind CSS", "Node.js", "Express"],
    "Database": ["Supabase", "Firebase", "PostgreSQL", "MongoDB"]
  }

  // Template Styles
  const isATS = variant.template_type === 'ats'

  // We use standard React/Tailwind to build the print page.
  // The @media print CSS handles hiding navbars, footers, etc. (we need to ensure layout handles this)
  return (
    <div className={`min-h-screen bg-muted/20 py-8 ${isATS ? 'font-sans' : ''}`}>
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="container max-w-4xl mx-auto px-4 mb-6 print:hidden flex justify-between items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <div>
           <span className="font-bold mr-2">{variant.title}</span>
           <span className="text-xs uppercase bg-muted px-2 py-1 rounded font-semibold">{isATS ? 'ATS Optimized' : 'Portfolio Premium'}</span>
        </div>
        <div className="flex gap-3">
          <PrintButton />
        </div>
      </div>

      {/* The Printable Page */}
      <div 
        id="resume-document"
        className={`mx-auto bg-white text-black shadow-2xl print:shadow-none ${
          isATS ? 'max-w-[800px] p-10 print:p-0 font-sans leading-tight' : 'max-w-4xl p-12 print:p-0 font-sans'
        }`}
        style={{ minHeight: '1123px' }} // A4 height approximation
      >
        
        {/* ATS MODE RENDERING */}
        {isATS && (
          <div className="space-y-6 text-[11pt]">
            {/* Header */}
            <header className="text-center border-b-2 border-black pb-4 mb-4">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-1 text-black">{profile?.full_name}</h1>
              <p className="text-lg text-black font-semibold mb-2">{profile?.title}</p>
              <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-black">
                <span>{profile?.email}</span>
                {profile?.linkedin_url && <span>• {profile.linkedin_url}</span>}
                {profile?.github_url && <span>• {profile.github_url}</span>}
              </div>
            </header>

            {/* Experience */}
            <section>
              <h2 className="text-lg font-bold uppercase border-b border-black mb-2 text-black">Experience</h2>
              <div className="space-y-3">
                {displayExperiences?.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between font-bold text-black">
                      <span>{exp.role}</span>
                      <span>{exp.start_date} {exp.is_current ? '- Present' : ''}</span>
                    </div>
                    <div className="font-semibold text-black italic">{exp.company}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-lg font-bold uppercase border-b border-black mb-2 text-black">Projects</h2>
              <div className="space-y-3">
                {displayProjects?.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between font-bold text-black">
                      <span>{proj.title}</span>
                      <span className="text-sm font-normal">{proj.tech_stack?.join(', ')}</span>
                    </div>
                    <p className="text-sm text-black mt-1">{proj.short_description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-lg font-bold uppercase border-b border-black mb-2 text-black">Education</h2>
              <div className="space-y-2">
                {displayEducation?.map((edu) => (
                  <div key={edu.id} className="flex justify-between text-black">
                    <div>
                      <span className="font-bold">{edu.institution}</span> - <span>{edu.degree}</span>
                    </div>
                    <span className="font-bold">{edu.start_date}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-bold uppercase border-b border-black mb-2 text-black">Technical Skills</h2>
              <div className="space-y-1 text-black">
                {Object.keys(displayGroupedSkills || {}).map((category) => (
                  <div key={category}>
                    <span className="font-bold">{category}: </span>
                    <span>{displayGroupedSkills[category].join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PORTFOLIO MODE RENDERING (Premium UI) */}
        {!isATS && (
          <div className="space-y-8 text-black">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 pb-8">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-gray-900">{profile?.full_name}</h1>
                <p className="text-2xl font-semibold text-blue-600">{profile?.title}</p>
              </div>
              <div className="text-right text-sm font-medium space-y-1 text-gray-600">
                <div className="flex items-center justify-end gap-2"><Mail size={14}/> {profile?.email}</div>
                {profile?.linkedin_url && <div className="flex items-center justify-end gap-2"><LinkIcon size={14}/> {profile.linkedin_url.replace('https://','')}</div>}
                {profile?.github_url && <div className="flex items-center justify-end gap-2"><Code size={14}/> {profile.github_url.replace('https://','')}</div>}
              </div>
            </header>

            {/* Two Column Layout */}
            <div className="grid grid-cols-12 gap-8">
              
              {/* Left Column (Main Content) */}
              <div className="col-span-8 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">Experience</h2>
                  <div className="space-y-6">
                    {displayExperiences?.map((exp) => (
                      <div key={exp.id} className="relative pl-4 border-l-2 border-blue-600">
                        <div className="absolute w-2 h-2 bg-blue-600 rounded-full -left-[5px] top-2"></div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                        <p className="text-blue-600 font-medium mb-1">{exp.company} • {exp.start_date}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">Projects</h2>
                  <div className="space-y-6">
                    {displayProjects?.map((proj) => (
                      <div key={proj.id} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{proj.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{proj.short_description}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.tech_stack?.slice(0,5).map((tech: string) => (
                            <span key={tech} className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="col-span-4 space-y-8">
                <section>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Education</h2>
                  <div className="space-y-4">
                    {displayEducation?.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-gray-900 leading-tight">{edu.degree}</h3>
                        <p className="text-gray-500 text-sm mt-1">{edu.institution}</p>
                        <p className="text-blue-600 font-medium text-xs mt-1">{edu.start_date}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Skills</h2>
                  <div className="space-y-4">
                    {Object.keys(displayGroupedSkills || {}).map((category) => (
                      <div key={category}>
                        <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-1">{category}</h4>
                        <div className="flex flex-wrap gap-1">
                          {displayGroupedSkills[category].map((s: string) => (
                            <span key={s} className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded border border-gray-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Certifications</h2>
                  <div className="space-y-3">
                    {displayCertifications?.map((cert) => (
                      <div key={cert.id}>
                        <h3 className="font-semibold text-sm text-gray-900 leading-tight">{cert.title}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">{cert.issuer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
