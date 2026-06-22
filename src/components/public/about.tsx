"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function About() {
  const highlights = [
    "B.Tech Computer Science (AI & ML)",
    "Specialized in Android Development",
    "Full Stack Web Engineer",
    "Passionate about System Design"
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I am a driven software engineer with a deep passion for artificial intelligence, mobile development, and creating scalable systems. My journey bridges the gap between complex backend architectures and intuitive, beautifully designed user interfaces.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Currently pursuing my B.Tech in AI & ML, I aim to leverage cutting-edge technologies to solve real-world problems. Whether it's building a native Android app, designing a predictive ML model, or architecting a robust SaaS platform, I thrive on engineering excellence.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
          >
            {/* Placeholder for an actual image of the user or a cool abstract tech graphic */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-secondary/20 flex flex-col items-center justify-center p-8 text-center">
               <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                 Code. Innovate. Deploy.
               </div>
               <p className="text-muted-foreground max-w-xs">
                 Combining AI precision with modern software engineering.
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
