"use client"

import { motion } from "framer-motion"
import { ArrowRight, Download, FileText } from "lucide-react"
import Link from "next/link"

export function RecruiterCTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none" />

          <div className="relative px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                <FileText size={12} />
                FOR RECRUITERS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Looking to hire?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                Get a complete overview of my skills, experience, and projects in a single recruiter-optimized page. Download my ATS-friendly resume or browse the interactive version.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href="/recruiter"
                className="group inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Recruiter Mode
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/resume"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-sm font-semibold shadow-sm transition-all hover:bg-card hover:shadow-md hover:-translate-y-0.5"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
