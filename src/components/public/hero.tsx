"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MapPin, Sparkles, ExternalLink } from "lucide-react"
import { getProxiedImageUrl } from "@/lib/utils"

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

interface HeroProps {
  profile?: {
    full_name?: string
    title?: string
    bio?: string
    email?: string
    avatar_url?: string
  } | null
}

export function Hero({ profile }: HeroProps) {
  const name = profile?.full_name || "Shivaram Nunugonda"
  const title = profile?.title || "AI & ML Engineer · Android Developer"
  const hasAvatar = !!profile?.avatar_url

  return (
    <section className="relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orb */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/6 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-8 max-w-screen-xl pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-center justify-between">
          
          {/* Left Column: Content */}
          <div className="flex-1 max-w-4xl flex flex-col items-start w-full">
            
            {/* Status badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Available for Internship · Summer 2026
              </div>
            </motion.div>

            {/* Name & headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-left"
            >
              Hi, I&apos;m{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                {name.split(" ")[0]}
              </span>
              <br />
              <span className="text-muted-foreground/80 text-[0.6em] md:text-[0.55em] font-semibold block mt-3 leading-tight">
                {title}
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground max-w-[640px] leading-relaxed mb-8 text-left"
            >
              {profile?.bio || "I build intelligent Android apps and AI-powered systems. Currently pursuing B.Tech in Computer Science (AI & ML), turning complex problems into elegant, production-grade solutions."}
            </motion.p>

            {/* Quick stats row */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-6 mb-10 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                <span>5+ Projects Shipped</span>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/recruiter"
                className="group inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                View Resume
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#projects"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm px-8 text-sm font-semibold shadow-sm transition-all hover:bg-card hover:shadow-md hover:-translate-y-0.5"
              >
                See My Work
              </Link>
              <a
                href={`mailto:${profile?.email || "shivaramnnp@gmail.com"}`}
                className="inline-flex h-12 items-center gap-2 px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink size={14} />
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Right Column: Profile Photo */}
          {hasAvatar && (
            <div className="flex-shrink-0 w-full lg:w-[300px] xl:w-[350px] flex justify-center lg:justify-end mb-10 lg:mb-0">
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative w-[192px] h-[192px] md:w-[256px] md:h-[256px] lg:w-[280px] lg:h-[280px] xl:w-[320px] xl:h-[320px]"
              >
                {/* Cyberpunk decoration elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-xl -m-4 pointer-events-none" />
                
                {/* Glowing border container */}
                <div className="relative group w-full h-full shrink-0">
                  {/* Outer glowing pulsing border */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-85 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  
                  {/* Inner image container */}
                  <div className="relative rounded-full w-full h-full overflow-hidden border-4 border-background bg-card shadow-2xl [transform:translate3d(0,0,0)] z-[1]">
                    <img
                      key={profile.avatar_url}
                      src={getProxiedImageUrl(profile.avatar_url)}
                      alt={name}
                      className="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  {/* Decorative orbital rings */}
                  <div className="absolute -inset-4 rounded-full border border-primary/20 pointer-events-none animate-[spin_20s_linear_infinite]" />
                  <div className="absolute -inset-8 rounded-full border border-secondary/15 border-dashed pointer-events-none animate-[spin_30s_linear_infinite_reverse]" />
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
