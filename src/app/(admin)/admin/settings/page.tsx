import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Plus, Trash2, Link as LinkIcon } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: links } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true })

  async function addLink(formData: FormData) {
    "use server"
    const platform = formData.get("platform") as string
    const url = formData.get("url") as string
    
    if (!platform || !url) return

    const supabase = await createClient()
    const { error } = await supabase.from('social_links').insert({ platform, url })
    if (error) {
      console.error("Error adding social link:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/settings')
  }

  async function deleteLink(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { error } = await supabase.from('social_links').delete().eq('id', formData.get("id"))
    if (error) {
      console.error("Error deleting social link:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/settings')
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings & SEO</h1>
        <p className="text-muted-foreground">Manage your Social Links and global configuration.</p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xl font-bold border-b border-border pb-2">
          <LinkIcon className="text-primary" /> Social Links
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <form action={addLink} className="flex flex-col sm:flex-row gap-4 items-end mb-8">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">Platform</label>
              <input type="text" name="platform" placeholder="e.g. GitHub, LinkedIn, Twitter" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
            </div>
            <div className="flex-[2] w-full">
              <label className="block text-sm font-medium mb-1">URL</label>
              <input type="url" name="url" placeholder="https://..." className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
            </div>
            <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors">
              <Plus size={18} /> Add Link
            </button>
          </form>

          <div className="space-y-3">
            {links?.length === 0 && <p className="text-sm text-muted-foreground">No social links added.</p>}
            {links?.map(link => (
              <div key={link.id} className="flex justify-between items-center p-4 bg-muted/50 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-bold">{link.platform}</span>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
                    {link.url}
                  </a>
                </div>
                <form action={deleteLink}>
                  <input type="hidden" name="id" value={link.id} />
                  <button className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for SEO Settings MVP */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xl font-bold border-b border-border pb-2">
          Global SEO
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <p className="text-muted-foreground text-sm mb-4">Default Meta Tags and Open Graph settings.</p>
          <div className="p-4 bg-muted border border-border rounded-lg text-center text-sm font-medium">
            SEO CMS integration coming soon in future updates.
          </div>
        </div>
      </section>
    </div>
  )
}
