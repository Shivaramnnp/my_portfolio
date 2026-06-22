"use client"

import { motion } from "framer-motion"
import { GraduationCap, Briefcase, Award, FileText } from "lucide-react"

export interface ExperienceData {
  id: string
  company: string
  role: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  document_url?: string
}

export interface EducationData {
  id: string
  institution: string
  degree: string
  start_date: string
  end_date?: string
  grade?: string
  document_url?: string
}

export interface CertificationData {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_url?: string
  document_url?: string
}

interface TimelineProps {
  experiences?: ExperienceData[]
  education?: EducationData[]
  certifications?: CertificationData[]
}

const defaultMilestones = [
  {
    year: "2025",
    title: "Diploma in ECE",
    detail: "Completed with 9.17 CGPA",
    icon: GraduationCap,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    document_url: null
  },
  {
    year: "2025",
    title: "Started B.Tech CS (AI & ML)",
    detail: "Specialized track in Artificial Intelligence",
    icon: GraduationCap,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    document_url: null
  },
  {
    year: "2026",
    title: "HiDevs Internship",
    detail: "Android Developer — Native apps & Jetpack Compose",
    icon: Briefcase,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    document_url: null
  },
  {
    year: "2026",
    title: "Built ShivaOS",
    detail: "Full-stack Developer OS with AI assistant & CMS",
    icon: Award,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    document_url: null
  },
]

const parseDateSafely = (dateStr: string | null | undefined, fallbackYear = "Present") => {
  if (!dateStr) return { date: new Date(), year: fallbackYear }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) {
    const matches = dateStr.match(/\b(19|20)\d{2}\b/)
    return {
      date: new Date(),
      year: matches ? matches[0] : dateStr
    }
  }
  return {
    date: d,
    year: d.getFullYear().toString()
  }
}

export function Timeline({ experiences = [], education = [], certifications = [] }: TimelineProps) {
  // Convert DB items into timeline milestones
  const experiencesMilestones = experiences.map(exp => {
    const { date, year } = parseDateSafely(exp.start_date, "Present")
    return {
      date,
      year,
      title: exp.role,
      detail: `${exp.company}${exp.is_current ? " (Current)" : ""}`,
      icon: Briefcase,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      document_url: exp.document_url || null
    }
  })

  const educationMilestones = education.map(edu => {
    const { date, year } = parseDateSafely(edu.start_date, "Present")
    return {
      date,
      year,
      title: edu.degree,
      detail: `${edu.institution}${edu.grade ? ` — Grade: ${edu.grade}` : ""}`,
      icon: GraduationCap,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      document_url: edu.document_url || null
    }
  })

  const certificationMilestones = certifications.map(cert => {
    const { date, year } = parseDateSafely(cert.issue_date, "Present")
    return {
      date,
      year,
      title: cert.title,
      detail: cert.issuer,
      icon: Award,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      document_url: cert.document_url || null
    }
  })

  // Merge and sort ascending
  let displayMilestones: any[] = [
    ...experiencesMilestones,
    ...educationMilestones,
    ...certificationMilestones
  ]

  if (displayMilestones.length > 0) {
    displayMilestones.sort((a, b) => a.date.getTime() - b.date.getTime())
  } else {
    displayMilestones = defaultMilestones
  }

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Journey so far
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Key milestones that shaped my engineering path.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {displayMilestones.map((m, i) => {
              const Icon = m.icon
              const isEven = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
                    <div className={`w-4 h-4 rounded-full border-2 border-background ring-2 ring-border ${m.bg}`}>
                      <div className={`w-full h-full rounded-full ${m.color} opacity-60`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className={`inline-flex items-center gap-2 mb-2 ${isEven ? "md:flex-row-reverse" : ""}`}>
                      <div className={`p-1.5 rounded-lg ${m.bg}`}>
                        <Icon size={16} className={m.color} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {m.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{m.title}</h3>
                    <p className="text-muted-foreground text-sm">{m.detail}</p>
                    
                    {m.document_url && (
                      <div className={`mt-3 ${isEven ? "md:flex md:justify-end" : ""}`}>
                        <a 
                          href={m.document_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium border border-primary/20 bg-primary/5 px-2.5 py-1 rounded"
                        >
                          <FileText size={12} /> View Certificate / Letter
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
