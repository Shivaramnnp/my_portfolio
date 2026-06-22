"use client"

import { motion } from "framer-motion"
import { 
  Code2, 
  Smartphone, 
  BrainCircuit, 
  Wrench, 
  Database, 
  Cloud, 
  Server, 
  Terminal, 
  Cpu, 
  Globe, 
  Lock, 
  Layers 
} from "lucide-react"

export interface Skill {
  id: string
  name: string
  category: string
  level?: number
  icon_name?: string
}

interface SkillsStripProps {
  skills?: Skill[]
}

const iconMap: Record<string, any> = {
  code: Code2,
  mobile: Smartphone,
  brain: BrainCircuit,
  tool: Wrench,
  database: Database,
  cloud: Cloud,
  server: Server,
  terminal: Terminal,
  cpu: Cpu,
  globe: Globe,
  lock: Lock,
  layers: Layers
}

const categoryIcons: Record<string, string> = {
  "Languages": "code",
  "Android & Mobile": "mobile",
  "AI & Machine Learning": "brain",
  "Tools & Backend": "tool"
}

const defaultStacks = [
  {
    label: "Languages",
    icon: Code2,
    items: ["Kotlin", "Java", "Python", "TypeScript", "C", "SQL"],
    accent: "from-blue-500/20 to-blue-500/5",
  },
  {
    label: "Android & Mobile",
    icon: Smartphone,
    items: ["Jetpack Compose", "MVVM", "Room", "Hilt", "Retrofit", "Coroutines"],
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    label: "AI & Machine Learning",
    icon: BrainCircuit,
    items: ["Gemini API", "LLMs", "Prompt Engineering", "RAG", "TensorFlow"],
    accent: "from-violet-500/20 to-violet-500/5",
  },
  {
    label: "Tools & Backend",
    icon: Wrench,
    items: ["Git", "Supabase", "Firebase", "Next.js", "Vercel", "Figma"],
    accent: "from-amber-500/20 to-amber-500/5",
  },
]

const accents = [
  "from-blue-500/20 to-blue-500/5",
  "from-emerald-500/20 to-emerald-500/5",
  "from-violet-500/20 to-violet-500/5",
  "from-amber-500/20 to-amber-500/5",
  "from-rose-500/20 to-rose-500/5",
  "from-cyan-500/20 to-cyan-500/5"
]

export function SkillsStrip({ skills = [] }: SkillsStripProps) {
  // If no database skills exist, fall back to the default list
  let displayStacks = defaultStacks

  if (skills.length > 0) {
    // Group DB skills by category
    const grouped = skills.reduce((acc: Record<string, string[]>, curr) => {
      if (!acc[curr.category]) acc[curr.category] = []
      acc[curr.category].push(curr.name)
      return acc
    }, {})

    // Map to categories dynamically
    displayStacks = Object.keys(grouped).map((catName, index) => {
      const firstSkillWithIcon = skills.find(s => s.category === catName && s.icon_name)
      const iconKey = firstSkillWithIcon?.icon_name || categoryIcons[catName] || "code"
      const Icon = iconMap[iconKey] || Code2

      return {
        label: catName,
        icon: Icon,
        items: grouped[catName],
        accent: accents[index % accents.length]
      }
    }).filter(s => s.items.length > 0) // Only display categories that have items
  }

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Tech I work with
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Core technologies across mobile, AI, and full-stack development.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayStacks.map((stack, i) => {
            const Icon = stack.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${stack.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-xl bg-muted group-hover:bg-background/80 transition-colors">
                      <Icon size={20} className="text-foreground/70" />
                    </div>
                    <h3 className="font-bold text-base">{stack.label}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground/70 backdrop-blur-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
