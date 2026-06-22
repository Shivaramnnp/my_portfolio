import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Plus, Trash2, FileText, CheckCircle2, Copy } from "lucide-react"
import Link from "next/link"

export default async function ResumeManagementPage() {
  const supabase = await createClient()
  
  const { data: variants } = await supabase.from('resume_variants').select('*').order('created_at', { ascending: false })

  async function createVariant(formData: FormData) {
    "use server"
    const title = formData.get("title") as string
    const template_type = formData.get("template_type") as string
    
    if (!title) return

    const supabase = await createClient()
    
    // Create variant
    const { data: newVariant, error } = await supabase.from('resume_variants').insert({ 
      title, 
      template_type 
    }).select().single()

    if (error) {
      console.error("Error creating resume variant:", error)
      throw new Error(error.message)
    }

    if (newVariant) {
      // By default, if it's the first one, make it public
      const { count, error: countError } = await supabase.from('resume_variants').select('*', { count: 'exact', head: true })
      if (!countError && count === 1) {
        const { error: updateError } = await supabase.from('resume_variants').update({ is_public_default: true }).eq('id', newVariant.id)
        if (updateError) {
          console.error("Error setting default public variant:", updateError)
          throw new Error(updateError.message)
        }
      }
    }
    
    revalidatePath('/admin/resumes')
  }

  async function deleteVariant(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { error } = await supabase.from('resume_variants').delete().eq('id', formData.get("id"))
    if (error) {
      console.error("Error deleting resume variant:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/resumes')
  }

  async function setPublicDefault(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const supabase = await createClient()
    
    // Unset all
    const { error: unsetError } = await supabase.from('resume_variants').update({ is_public_default: false }).neq('id', '00000000-0000-0000-0000-000000000000')
    if (unsetError) {
      console.error("Error unsetting default public variants:", unsetError)
      throw new Error(unsetError.message)
    }
    // Set new
    const { error: setError } = await supabase.from('resume_variants').update({ is_public_default: true }).eq('id', id)
    if (setError) {
      console.error("Error setting default public variant:", setError)
      throw new Error(setError.message)
    }
    
    revalidatePath('/admin/resumes')
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Builder</h1>
        <p className="text-muted-foreground">Manage your tailored resume variants and generate PDFs.</p>
      </div>

      {/* Add New Variant */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create Resume Variant</h2>
        <form action={createVariant} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-[2] w-full">
            <label htmlFor="title" className="block text-sm font-medium mb-1">Variant Title</label>
            <input type="text" id="title" name="title" placeholder="e.g. Google Internship, Android Dev" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="template_type" className="block text-sm font-medium mb-1">Template</label>
            <select id="template_type" name="template_type" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required>
              <option value="portfolio">Portfolio (Premium)</option>
              <option value="ats">ATS (Minimal)</option>
            </select>
          </div>
          <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} /> Create
          </button>
        </form>
      </div>

      {/* List Existing Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variants?.map((variant) => (
          <div key={variant.id} className={`flex flex-col border rounded-xl overflow-hidden shadow-sm transition-colors ${variant.is_public_default ? 'border-primary ring-1 ring-primary/20' : 'border-border bg-card'}`}>
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>
                {variant.is_public_default && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={14} /> Public Default
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{variant.title}</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-6">
                {variant.template_type === 'ats' ? 'ATS Minimal' : 'Portfolio Premium'}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                <Link href={`/resume/variants/${variant.id}`} target="_blank" className="text-sm font-medium text-foreground hover:underline">
                  Preview PDF
                </Link>
                {/* Future implementation: Selection Page Link */}
                <Link href={`/admin/resumes/${variant.id}`} className="text-sm font-medium text-primary hover:underline ml-auto">
                  Configure Content &rarr;
                </Link>
              </div>
            </div>
            <div className="p-3 bg-muted/50 border-t border-border flex justify-between items-center gap-2">
               <form action={setPublicDefault} className="flex-1">
                 <input type="hidden" name="id" value={variant.id} />
                 <button disabled={variant.is_public_default} className={`w-full py-1.5 rounded text-xs font-medium transition-colors ${variant.is_public_default ? 'text-muted-foreground cursor-not-allowed' : 'hover:bg-muted text-foreground border border-border bg-background shadow-sm'}`}>
                   Set Default
                 </button>
               </form>
               <form action={deleteVariant}>
                 <input type="hidden" name="id" value={variant.id} />
                 <button className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors">
                   <Trash2 size={16} />
                 </button>
               </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
