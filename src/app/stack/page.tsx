import { createClient } from "@/lib/supabase/server"
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
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('os_name').limit(1).single()
  const osName = profile?.os_name || "ShivaOS"
  return {
    title: `Tech Stack | ${osName}`,
    description: "The tools, languages, and frameworks I use to build software.",
  }
}

export default async function StackPage() {
  const supabase = await createClient()
  const { data: skillsData } = await supabase
    .from('skills')
    .select('*')
    .order('level', { ascending: false })

  const skills = skillsData || []

  const defaultStack = [
    {
      category: "Languages",
      icon: <Code2 className="h-6 w-6" />,
      items: ["Kotlin", "Java", "Python", "C", "TypeScript", "SQL"]
    },
    {
      category: "Android & Mobile",
      icon: <Smartphone className="h-6 w-6" />,
      items: ["Jetpack Compose", "MVVM Architecture", "Room Database", "Hilt/Dagger", "Retrofit", "Coroutines"]
    },
    {
      category: "AI & Machine Learning",
      icon: <BrainCircuit className="h-6 w-6" />,
      items: ["Google Gemini API", "LLMs (Large Language Models)", "Prompt Engineering", "RAG (Retrieval-Augmented Generation)", "TensorFlow"]
    },
    {
      category: "Tools & Backend",
      icon: <Wrench className="h-6 w-6" />,
      items: ["Git & GitHub", "Supabase", "Firebase", "Next.js", "Vercel", "Figma"]
    }
  ]

  let displayStack = defaultStack

  if (skills.length > 0) {
    const grouped = skills.reduce((acc: Record<string, string[]>, curr) => {
      if (!acc[curr.category]) acc[curr.category] = []
      acc[curr.category].push(curr.name)
      return acc
    }, {})

    const iconMap: Record<string, any> = {
      code: <Code2 className="h-6 w-6" />,
      mobile: <Smartphone className="h-6 w-6" />,
      brain: <BrainCircuit className="h-6 w-6" />,
      tool: <Wrench className="h-6 w-6" />,
      database: <Database className="h-6 w-6" />,
      cloud: <Cloud className="h-6 w-6" />,
      server: <Server className="h-6 w-6" />,
      terminal: <Terminal className="h-6 w-6" />,
      cpu: <Cpu className="h-6 w-6" />,
      globe: <Globe className="h-6 w-6" />,
      lock: <Lock className="h-6 w-6" />,
      layers: <Layers className="h-6 w-6" />
    }

    const categoryIcons: Record<string, string> = {
      "Languages": "code",
      "Android & Mobile": "mobile",
      "AI & Machine Learning": "brain",
      "Tools & Backend": "tool"
    }

    displayStack = Object.keys(grouped).map(cat => {
      const firstSkillWithIcon = skills.find(s => s.category === cat && s.icon_name)
      const iconKey = firstSkillWithIcon?.icon_name || categoryIcons[cat] || "code"
      return {
        category: cat,
        icon: iconMap[iconKey] || <Code2 className="h-6 w-6" />,
        items: grouped[cat]
      }
    })
  }

  return (
    <div className="min-h-screen bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
        
        <header className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Stack</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            A comprehensive list of the languages, frameworks, and tools I use to build robust, scalable, and intelligent software systems.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {displayStack.map((group, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-muted rounded-xl text-foreground">
                  {group.icon}
                </div>
                <h2 className="text-2xl font-bold">{group.category}</h2>
              </div>
              <ul className="space-y-3">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 text-center">
          <h3 className="text-2xl font-bold mb-4">Always Learning</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The tech landscape moves fast. While these are my core competencies, I am constantly exploring new paradigms, reading engineering blogs, and expanding my toolkit to solve complex problems more effectively.
          </p>
        </section>

      </div>
    </div>
  )
}
