import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Toast } from "@/components/admin/toast"

export default async function AdminProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const params = await searchParams
  const isSaved = params.saved === "true"
  const isDeleted = params.deleted === "true"

  const supabase = await createClient()
  const { data: projects, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })

  // Basic Server Action for delete
  async function deleteProject(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (!id) return
    const supabase = await createClient()
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      console.error("Error deleting project:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/projects')
    redirect("/admin/projects?deleted=true")
  }

  return (
    <div className="space-y-6">
      {isSaved && <Toast message="Project saved successfully!" />}
      {isDeleted && <Toast message="Project deleted successfully!" />}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Link href="/admin/projects/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Link>
      </div>
      
      <div className="rounded-md border border-border bg-card">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b border-border">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Featured</th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {projects?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">No projects found.</td>
                </tr>
              )}
              {projects?.map((project) => (
                <tr key={project.id} className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{project.title}</td>
                  <td className="p-4 align-middle">
                    {project.is_featured ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">Yes</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/projects/${project.slug}`} target="_blank" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/admin/projects/${project.id}/edit`} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <form action={deleteProject}>
                        <input type="hidden" name="id" value={project.id} />
                        <button type="submit" className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
