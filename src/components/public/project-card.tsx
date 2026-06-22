"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Code, ExternalLink, PlayCircle } from "lucide-react"

export interface ProjectData {
  id: string
  title: string
  slug: string
  short_description: string
  image_url: string
  tech_stack: string[]
  github_url?: string
  live_url?: string
  demo_video_url?: string
}

export function ProjectCard({ project, index }: { project: ProjectData, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-primary/50"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-primary/10 to-secondary/10">
            <span className="text-muted-foreground font-medium">Image Placeholder</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
          <div className="flex gap-3">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" title="GitHub">
                <Code size={18} />
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" title="Live Site">
                <ExternalLink size={18} />
              </a>
            )}
            {project.demo_video_url && (
              <a href={project.demo_video_url} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" title="Watch Demo">
                <PlayCircle size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack.slice(0, 3).map((tech) => (
            <span key={tech} className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground/80">
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 3 && (
            <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground/80">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>
        
        <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
          <Link href={`/projects/${project.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {project.title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
          {project.short_description}
        </p>
        
        <div className="mt-auto flex items-center text-sm font-medium text-primary">
          Read Case Study
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  )
}
