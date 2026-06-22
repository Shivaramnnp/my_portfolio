import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { 
  Plus, 
  Trash2, 
  Edit2, 
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
  Layers,
  Sparkles,
  Check
} from "lucide-react"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"

// Map of icon names to components for rendering
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

// Full names of the icons for display
const iconNames: Record<string, string> = {
  code: "Languages / Code",
  mobile: "Mobile / Android",
  brain: "AI & Machine Learning",
  tool: "Tools & Backend",
  database: "Databases & Storage",
  cloud: "Cloud & DevOps",
  server: "Backend & APIs",
  terminal: "CLI & Scripts",
  cpu: "Core Systems / Hardware",
  globe: "Web & Frontend",
  lock: "Security & Auth",
  layers: "Architecture / Frameworks"
}

import { Toast } from "@/components/admin/toast"

export default async function StackManagementPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const params = await searchParams
  const isSaved = params.saved === "true"
  const isDeleted = params.deleted === "true"

  const supabase = await createClient()
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('level', { ascending: false })

  const items = skills || []

  // Group items by category
  const grouped = items.reduce((acc: Record<string, typeof items>, curr) => {
    if (!acc[curr.category]) acc[curr.category] = []
    acc[curr.category].push(curr)
    return acc
  }, {})

  // Server Action: Add a skill to an existing or new category
  async function addSkill(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const icon_name = formData.get("icon_name") as string || "code"

    if (!name || !category) return

    const supabase = await createClient()
    const { error } = await supabase.from('skills').insert({
      name,
      category,
      icon_name,
      level: 5 // Default level
    })

    if (error) {
      console.error("Error adding skill:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/stack')
    revalidatePath('/stack')
    revalidatePath('/')
    redirect("/admin/stack?saved=true")
  }

  // Server Action: Delete a single skill
  async function deleteSkill(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (!id) return

    const supabase = await createClient()
    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (error) {
      console.error("Error deleting skill:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/stack')
    revalidatePath('/stack')
    revalidatePath('/')
    redirect("/admin/stack?deleted=true")
  }

  // Server Action: Update category name & icon
  async function updateCategory(formData: FormData) {
    "use server"
    const oldCategory = formData.get("old_category") as string
    const newCategory = formData.get("new_category") as string
    const icon_name = formData.get("icon_name") as string

    if (!oldCategory || !newCategory) return

    const supabase = await createClient()
    const { error } = await supabase
      .from('skills')
      .update({ category: newCategory, icon_name })
      .eq('category', oldCategory)

    if (error) {
      console.error("Error updating category:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/stack')
    revalidatePath('/stack')
    revalidatePath('/')
    redirect("/admin/stack?saved=true")
  }

  // Server Action: Delete an entire category
  async function deleteCategory(formData: FormData) {
    "use server"
    const category = formData.get("category") as string
    if (!category) return

    const supabase = await createClient()
    const { error } = await supabase.from('skills').delete().eq('category', category)

    if (error) {
      console.error("Error deleting category:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/stack')
    revalidatePath('/stack')
    revalidatePath('/')
    redirect("/admin/stack?deleted=true")
  }

  // Server Action: Import default stack values
  async function importDefaults() {
    "use server"
    const defaults = [
      // Languages
      { name: "Kotlin", category: "Languages", icon_name: "code", level: 9 },
      { name: "Java", category: "Languages", icon_name: "code", level: 8 },
      { name: "Python", category: "Languages", icon_name: "code", level: 8 },
      { name: "C", category: "Languages", icon_name: "code", level: 7 },
      { name: "TypeScript", category: "Languages", icon_name: "code", level: 8 },
      { name: "SQL", category: "Languages", icon_name: "code", level: 7 },

      // Mobile
      { name: "Jetpack Compose", category: "Android & Mobile", icon_name: "mobile", level: 9 },
      { name: "MVVM Architecture", category: "Android & Mobile", icon_name: "mobile", level: 9 },
      { name: "Room Database", category: "Android & Mobile", icon_name: "mobile", level: 8 },
      { name: "Hilt/Dagger", category: "Android & Mobile", icon_name: "mobile", level: 8 },
      { name: "Retrofit", category: "Android & Mobile", icon_name: "mobile", level: 9 },
      { name: "Coroutines", category: "Android & Mobile", icon_name: "mobile", level: 9 },

      // AI/ML
      { name: "Google Gemini API", category: "AI & Machine Learning", icon_name: "brain", level: 9 },
      { name: "LLMs (Large Language Models)", category: "AI & Machine Learning", icon_name: "brain", level: 8 },
      { name: "Prompt Engineering", category: "AI & Machine Learning", icon_name: "brain", level: 9 },
      { name: "RAG (Retrieval-Augmented Generation)", category: "AI & Machine Learning", icon_name: "brain", level: 8 },
      { name: "TensorFlow", category: "AI & Machine Learning", icon_name: "brain", level: 6 },

      // Tools
      { name: "Git & GitHub", category: "Tools & Backend", icon_name: "tool", level: 9 },
      { name: "Supabase", category: "Tools & Backend", icon_name: "tool", level: 8 },
      { name: "Firebase", category: "Tools & Backend", icon_name: "tool", level: 8 },
      { name: "Next.js", category: "Tools & Backend", icon_name: "tool", level: 8 },
      { name: "Vercel", category: "Tools & Backend", icon_name: "tool", level: 8 },
      { name: "Figma", category: "Tools & Backend", icon_name: "tool", level: 7 }
    ]

    const supabase = await createClient()
    const { error } = await supabase.from('skills').insert(defaults)

    if (error) {
      console.error("Error importing defaults:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/stack')
    revalidatePath('/stack')
    revalidatePath('/')
    redirect("/admin/stack?saved=true")
  }

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {isSaved && <Toast message="Stack updated successfully!" />}
      {isDeleted && <Toast message="Item deleted successfully!" />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Stack Management</h1>
          <p className="text-muted-foreground">Manage your technical stack, headings/categories, and icons dynamically.</p>
        </div>
        
        {items.length === 0 && (
          <form action={importDefaults}>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 text-sm font-medium rounded-md hover:bg-primary/20 transition-colors">
              <Sparkles size={16} /> Import Default Tech Stack
            </button>
          </form>
        )}
      </div>

      {/* Add New Category Panel */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Create New Category / Heading</h2>
        <form action={addSkill} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category Name</label>
              <input 
                type="text" 
                id="category" 
                name="category" 
                placeholder="e.g. Web Frameworks" 
                className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
                required 
              />
            </div>
            <div>
              <label htmlFor="icon_name" className="block text-sm font-medium mb-1">Category Icon</label>
              <select 
                id="icon_name" 
                name="icon_name" 
                className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
              >
                {Object.keys(iconNames).map(key => (
                  <option key={key} value={key}>{iconNames[key]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">First Skill Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="e.g. React" 
              className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
              required 
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} /> Create Category & Add Skill
          </button>
        </form>
      </div>

      {/* Grid of Grouped Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.keys(grouped).map(catName => {
          const catSkills = grouped[catName]
          // Find icon for this category
          const firstSkillWithIcon = catSkills.find(s => s.icon_name)
          const iconKey = firstSkillWithIcon?.icon_name || "code"
          const Icon = iconMap[iconKey] || Code2

          return (
            <div key={catName} className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
              {/* Category Header */}
              <div className="p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg">{catName}</h3>
                </div>
                
                {/* Category Actions */}
                <div className="flex items-center gap-2">
                  {/* Edit Category Modal Trigger / Inline Form */}
                  <form action={updateCategory} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="old_category" value={catName} />
                    <input 
                      type="text" 
                      name="new_category" 
                      defaultValue={catName} 
                      placeholder="Rename category..." 
                      className="p-1.5 text-xs rounded border border-input bg-background focus:ring-1 focus:ring-primary outline-none w-32" 
                      required 
                    />
                    <select 
                      name="icon_name" 
                      defaultValue={iconKey} 
                      className="p-1.5 text-xs rounded border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                    >
                      {Object.keys(iconNames).map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                    <button type="submit" className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors" title="Save Changes">
                      <Check size={14} />
                    </button>
                  </form>

                  <ConfirmDeleteForm action={deleteCategory} categoryName={catName} />
                </div>
              </div>

              {/* Skills List in Category */}
              <div className="p-5 flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {catSkills.map(skill => (
                    <div key={skill.id} className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-medium border border-border">
                      <span>{skill.name}</span>
                      <form action={deleteSkill} className="inline-flex">
                        <input type="hidden" name="id" value={skill.id} />
                        <button type="submit" className="text-muted-foreground/60 hover:text-destructive transition-colors">
                          &times;
                        </button>
                      </form>
                    </div>
                  ))}
                  {catSkills.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Add Skill to Category Footer */}
              <div className="p-4 border-t border-border bg-muted/10">
                <form action={addSkill} className="flex gap-2">
                  <input type="hidden" name="category" value={catName} />
                  <input type="hidden" name="icon_name" value={iconKey} />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder={`Add skill to ${catName}...`} 
                    className="flex-1 p-2 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" 
                    required 
                  />
                  <button type="submit" className="inline-flex items-center justify-center px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                    <Plus size={16} />
                  </button>
                </form>
              </div>
            </div>
          )
        })}

        {Object.keys(grouped).length === 0 && (
          <div className="col-span-2 text-center py-12 border border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No technical stack categories found.</p>
            <p className="text-sm text-muted-foreground mt-1">Create a new category above or click "Import Default Tech Stack" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
