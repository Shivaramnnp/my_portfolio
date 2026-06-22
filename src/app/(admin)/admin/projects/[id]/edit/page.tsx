import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { uploadFile } from "@/lib/supabase/upload"
import { Save } from "lucide-react"
import { FileInput } from "@/components/admin/file-input"

export default async function EditProjectPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the project to edit
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  async function updateProject(formData: FormData) {
    "use server"
    
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const short_description = formData.get("short_description") as string
    const is_featured = formData.get("is_featured") === "on"
    const imageFile = formData.get("image") as File | null
    const removeImage = formData.get("remove_image") === "on"
    
    const tech_stack_raw = formData.get("tech_stack") as string
    const tech_stack = tech_stack_raw.split(",").map(t => t.trim()).filter(Boolean)

    const supabase = await createClient()

    let imageUrl = project.image_url

    if (removeImage) {
      imageUrl = null
    } else if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, "projects")
    }

    const { error } = await supabase.from('projects').update({
      title,
      slug,
      short_description,
      tech_stack,
      is_featured,
      image_url: imageUrl
    }).eq('id', id)

    if (!error) {
      redirect("/admin/projects?saved=true")
    } else {
      console.error("Error updating project:", error)
      throw new Error(error.message)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      
      <form action={updateProject} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            defaultValue={project.title} 
            required 
            className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input 
            type="text" 
            id="slug" 
            name="slug" 
            defaultValue={project.slug} 
            required 
            className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>

        <div>
          <label htmlFor="short_description" className="block text-sm font-medium mb-1">Short Description</label>
          <textarea 
            id="short_description" 
            name="short_description" 
            rows={3} 
            defaultValue={project.short_description || ""} 
            className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
          ></textarea>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">Project Screenshot / Image</label>
          <div className="flex flex-col gap-3 mb-2">
            {project.image_url && (
              <div className="flex items-center gap-4 border border-border p-2 rounded-lg bg-muted/20 w-fit">
                <img src={project.image_url} alt="Screenshot" className="h-16 w-24 object-cover rounded border border-border" />
                <label className="flex items-center gap-2 text-sm text-destructive font-medium cursor-pointer">
                  <input type="checkbox" name="remove_image" className="w-4 h-4 rounded" /> Remove screenshot image
                </label>
              </div>
            )}
            <FileInput 
              id="image" 
              name="image" 
              accept="image/*" 
              label="Max file size: 10MB." 
            />
          </div>
        </div>

        <div>
          <label htmlFor="tech_stack" className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
          <input 
            type="text" 
            id="tech_stack" 
            name="tech_stack" 
            defaultValue={project.tech_stack?.join(", ") || ""} 
            placeholder="Next.js, TypeScript, Tailwind" 
            className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="is_featured" 
            name="is_featured" 
            defaultChecked={project.is_featured} 
            className="w-4 h-4 rounded border-input" 
          />
          <label htmlFor="is_featured" className="text-sm font-medium">Feature on Home Page</label>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <a href="/admin/projects" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">Cancel</a>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
