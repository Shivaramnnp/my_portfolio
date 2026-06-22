"use client"

import { ProjectCard, ProjectData } from "./project-card"
import { motion } from "framer-motion"

interface ProjectGridProps {
  projects: ProjectData[]
  title?: string
  description?: string
}

export function ProjectGrid({ projects, title = "Featured Projects", description = "A selection of my best work." }: ProjectGridProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="mb-12 md:text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
