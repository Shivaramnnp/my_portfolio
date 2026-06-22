import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Plus, Trash2, Calendar, FileText } from "lucide-react"
import { uploadFile } from "@/lib/supabase/upload"
import { FileInput } from "@/components/admin/file-input"

export default async function BlogManagementPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false })

  async function addPost(formData: FormData) {
    "use server"
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const content = formData.get("content") as string
    const imageFile = formData.get("image") as File | null

    if (!title || !slug || !content) return

    const supabase = await createClient()
    const imageUrl = await uploadFile(imageFile, "blog")

    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      content,
      image_url: imageUrl,
      published_at: new Date().toISOString()
    })

    if (error) {
      console.error("Error creating blog post:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/blog')
  }

  async function deletePost(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (!id) return

    const supabase = await createClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
      console.error("Error deleting blog post:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/blog')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
      
      {/* Create New Post Form */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Write New Article</h2>
        <form action={addPost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Article Title</label>
              <input type="text" id="title" name="title" placeholder="e.g. Building with Gemini Flash 3.5" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug (URL)</label>
              <input type="text" id="slug" name="slug" placeholder="e.g. building-with-gemini" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">Cover Image</label>
            <FileInput id="image" name="image" accept="image/*" label="Max file size: 10MB." />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
            <textarea id="content" name="content" rows={8} placeholder="Write your article content here..." className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-y" required></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors">
              <Plus size={18} /> Publish Post
            </button>
          </div>
        </form>
      </div>

      {/* List Existing Articles */}
      <div className="rounded-md border border-border bg-card">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b border-border">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Title</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Published Date</th>
              <th className="h-10 px-4 text-right font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts?.length === 0 && (
              <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No articles published yet.</td></tr>
            )}
            {posts?.map((post) => (
              <tr key={post.id} className="border-b border-border transition-colors hover:bg-muted/50">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    {post.image_url ? (
                      <img src={post.image_url} alt="" className="w-10 h-10 rounded object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground">
                        <FileText size={16} />
                      </div>
                    )}
                    <span>{post.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} />
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
