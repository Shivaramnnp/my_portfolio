import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Plus, Trash2, GraduationCap, Briefcase, Award, FileText, Edit2, Save } from "lucide-react"
import { uploadFile } from "@/lib/supabase/upload"
import { Toast } from "@/components/admin/toast"
import { FileInput } from "@/components/admin/file-input"

export default async function TimelineManagementPage({
  searchParams
}: {
  searchParams: Promise<{ 
    saved?: string; 
    deleted?: string; 
    edit?: "experience" | "education" | "certification"; 
    id?: string 
  }>
}) {
  const params = await searchParams
  const isSaved = params.saved === "true"
  const isDeleted = params.deleted === "true"
  const editType = params.edit
  const editId = params.id

  const supabase = await createClient()

  // Fetch edit item if active
  let editItem: any = null
  if (editType && editId) {
    const table = editType === "experience" ? "experiences" : editType === "education" ? "education" : "certifications"
    const { data } = await supabase.from(table).select('*').eq('id', editId).single()
    editItem = data
  }
  
  const [
    { data: experiences },
    { data: education },
    { data: certifications }
  ] = await Promise.all([
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('education').select('*').order('start_date', { ascending: false }),
    supabase.from('certifications').select('*').order('issue_date', { ascending: false })
  ])

  // Server Actions for Experience
  async function addExperience(formData: FormData) {
    "use server"
    const docFile = formData.get("document") as File | null
    let docUrl = null
    if (docFile && docFile.size > 0) {
      docUrl = await uploadFile(docFile, "documents")
    }

    const supabase = await createClient()
    const { error } = await supabase.from('experiences').insert({
      company: formData.get("company"),
      role: formData.get("role"),
      start_date: formData.get("start_date") || new Date().toISOString(),
      end_date: formData.get("end_date") || null,
      is_current: formData.get("is_current") === "on",
      location: formData.get("location") || null,
      description: formData.get("description") || null,
      document_url: docUrl
    })
    if (error) {
      console.error("Error adding experience:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?saved=true")
  }

  async function editExperience(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (!id) return

    const docFile = formData.get("document") as File | null
    const removeDoc = formData.get("remove_document") === "on"

    const supabase = await createClient()
    const { data: current } = await supabase.from('experiences').select('document_url').eq('id', id).single()

    let docUrl = current?.document_url || null
    if (removeDoc) {
      docUrl = null
    } else if (docFile && docFile.size > 0) {
      docUrl = await uploadFile(docFile, "documents")
    }

    const { error } = await supabase.from('experiences').update({
      company: formData.get("company"),
      role: formData.get("role"),
      location: formData.get("location") || null,
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date") || null,
      is_current: formData.get("is_current") === "on",
      description: formData.get("description") || null,
      document_url: docUrl
    }).eq('id', id)

    if (error) {
      console.error("Error editing experience:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?saved=true")
  }

  async function deleteExperience(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { error } = await supabase.from('experiences').delete().eq('id', formData.get("id"))
    if (error) {
      console.error("Error deleting experience:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?deleted=true")
  }

  // Server Actions for Education
  async function addEducation(formData: FormData) {
    "use server"
    const docFile = formData.get("document") as File | null
    let docUrl = null
    if (docFile && docFile.size > 0) {
      docUrl = await uploadFile(docFile, "documents")
    }

    const supabase = await createClient()
    const { error } = await supabase.from('education').insert({
      institution: formData.get("institution"),
      degree: formData.get("degree"),
      field_of_study: formData.get("field_of_study") || null,
      start_date: formData.get("start_date") || new Date().toISOString(),
      end_date: formData.get("end_date") || null,
      grade: formData.get("grade") || null,
      description: formData.get("description") || null,
      document_url: docUrl
    })
    if (error) {
      console.error("Error adding education:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?saved=true")
  }

  async function editEducation(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (!id) return

    const docFile = formData.get("document") as File | null
    const removeDoc = formData.get("remove_document") === "on"

    const supabase = await createClient()
    const { data: current } = await supabase.from('education').select('document_url').eq('id', id).single()

    let docUrl = current?.document_url || null
    if (removeDoc) {
      docUrl = null
    } else if (docFile && docFile.size > 0) {
      docUrl = await uploadFile(docFile, "documents")
    }

    const { error } = await supabase.from('education').update({
      institution: formData.get("institution"),
      degree: formData.get("degree"),
      field_of_study: formData.get("field_of_study") || null,
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date") || null,
      grade: formData.get("grade") || null,
      description: formData.get("description") || null,
      document_url: docUrl
    }).eq('id', id)

    if (error) {
      console.error("Error editing education:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?saved=true")
  }

  async function deleteEducation(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { error } = await supabase.from('education').delete().eq('id', formData.get("id"))
    if (error) {
      console.error("Error deleting education:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?deleted=true")
  }

  // Server Actions for Certifications
  async function addCertification(formData: FormData) {
    "use server"
    const docFile = formData.get("document") as File | null
    let docUrl = null
    if (docFile && docFile.size > 0) {
      docUrl = await uploadFile(docFile, "documents")
    }

    const supabase = await createClient()
    const { error } = await supabase.from('certifications').insert({
      title: formData.get("title"),
      issuer: formData.get("issuer"),
      issue_date: formData.get("issue_date") || new Date().toISOString(),
      credential_url: formData.get("credential_url") || null,
      document_url: docUrl
    })
    if (error) {
      console.error("Error adding certification:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?saved=true")
  }

  async function editCertification(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (!id) return

    const docFile = formData.get("document") as File | null
    const removeDoc = formData.get("remove_document") === "on"

    const supabase = await createClient()
    const { data: current } = await supabase.from('certifications').select('document_url').eq('id', id).single()

    let docUrl = current?.document_url || null
    if (removeDoc) {
      docUrl = null
    } else if (docFile && docFile.size > 0) {
      docUrl = await uploadFile(docFile, "documents")
    }

    const { error } = await supabase.from('certifications').update({
      title: formData.get("title"),
      issuer: formData.get("issuer"),
      issue_date: formData.get("issue_date"),
      credential_url: formData.get("credential_url") || null,
      document_url: docUrl
    }).eq('id', id)

    if (error) {
      console.error("Error editing certification:", error)
      throw new Error(error.message)
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?saved=true")
  }

  async function deleteCertification(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { error } = await supabase.from('certifications').delete().eq('id', formData.get("id"))
    if (error) {
      console.error("Error deleting certification:", error)
      throw new Error(error.message)
    }
    revalidatePath('/admin/timeline')
    revalidatePath('/')
    redirect("/admin/timeline?deleted=true")
  }

  return (
    <div className="space-y-12 max-w-7xl">
      {isSaved && <Toast message="Timeline saved successfully!" />}
      {isDeleted && <Toast message="Item deleted successfully!" />}
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Timeline Management</h1>
        <p className="text-muted-foreground">Manage your Work Experience, Education, and Certifications.</p>
      </div>

      {/* EDITING FORM CONTAINER */}
      {editItem && (
        <div className="bg-card border-2 border-primary p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              Edit {editType === "experience" ? "Work Experience" : editType === "education" ? "Education Entry" : "Certification"}
            </h2>
            <a href="/admin/timeline" className="text-xs text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider bg-muted px-2.5 py-1 rounded">Cancel Edit</a>
          </div>

          <form action={editType === "experience" ? editExperience : editType === "education" ? editEducation : editCertification} className="space-y-4 max-w-4xl">
            <input type="hidden" name="id" value={editItem.id} />
            
            {editType === "experience" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Company</label>
                    <input type="text" name="company" defaultValue={editItem.company} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Role / Title</label>
                    <input type="text" name="role" defaultValue={editItem.role} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Start Date</label>
                    <input type="date" name="start_date" defaultValue={editItem.start_date} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">End Date (Optional)</label>
                    <input type="date" name="end_date" defaultValue={editItem.end_date || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium mt-6">
                    <input type="checkbox" name="is_current" defaultChecked={editItem.is_current} className="w-4 h-4 rounded" /> Current Job
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Location</label>
                    <input type="text" name="location" defaultValue={editItem.location || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description / Bullet points</label>
                    <textarea name="description" rows={3} defaultValue={editItem.description || ""} className="w-full p-2 rounded border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </>
            )}

            {editType === "education" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Institution</label>
                    <input type="text" name="institution" defaultValue={editItem.institution} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Degree / Course</label>
                    <input type="text" name="degree" defaultValue={editItem.degree} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Start Date</label>
                    <input type="date" name="start_date" defaultValue={editItem.start_date || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">End Date</label>
                    <input type="date" name="end_date" defaultValue={editItem.end_date || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Grade / CGPA</label>
                    <input type="text" name="grade" defaultValue={editItem.grade || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Field of Study</label>
                    <input type="text" name="field_of_study" defaultValue={editItem.field_of_study || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea name="description" rows={3} defaultValue={editItem.description || ""} className="w-full p-2 rounded border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </>
            )}

            {editType === "certification" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Certification Title</label>
                    <input type="text" name="title" defaultValue={editItem.title} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Issuer / Organization</label>
                    <input type="text" name="issuer" defaultValue={editItem.issuer} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Issue Date</label>
                    <input type="date" name="issue_date" defaultValue={editItem.issue_date || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Credential URL (Optional)</label>
                    <input type="url" name="credential_url" defaultValue={editItem.credential_url || ""} className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </>
            )}

            {/* Document upload / removal section */}
            <div className="border border-border p-4 rounded-lg bg-muted/10 space-y-3">
              <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide">Document Attachment</label>
              
              {editItem.document_url && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded font-medium border border-primary/20">Attachment Present</span>
                  <a href={editItem.document_url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground underline hover:text-foreground">View Current File</a>
                  <label className="flex items-center gap-2 text-xs text-destructive font-semibold cursor-pointer ml-4">
                    <input type="checkbox" name="remove_document" className="w-3.5 h-3.5 rounded" /> Remove Current Document
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1">{editItem.document_url ? "Replace with New File" : "Upload Document / Certificate"}</label>
                <FileInput name="document" accept="image/*,application/pdf" className="w-full text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" label="Max size: 10MB." />
              </div>
            </div>

            <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors">
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* EXPERIENCE SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold border-b border-border pb-2">
            <Briefcase className="text-primary" /> Experience
          </div>
          
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
            <form action={addExperience} className="space-y-4">
              <input type="text" name="company" placeholder="Company Name" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
              <input type="text" name="role" placeholder="Role / Title" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <input type="date" name="start_date" className="p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                <input type="date" name="end_date" placeholder="End Date" className="p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" name="is_current" className="w-4 h-4 rounded" /> Current
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="location" placeholder="Location (e.g. New York, Remote)" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                <textarea name="description" placeholder="Job description..." rows={2} className="w-full p-2 rounded border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Experience Letter / Document</label>
                <FileInput name="document" accept="image/*,application/pdf" className="w-full text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" label="Max size: 10MB." />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Experience
              </button>
            </form>
          </div>
 
          <div className="space-y-3">
            {experiences?.map(exp => (
              <div key={exp.id} className="flex justify-between items-start p-4 bg-card border border-border rounded-lg shadow-sm">
                <div>
                  <h4 className="font-bold">{exp.role}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company} • Started: {exp.start_date}</p>
                  {exp.document_url && (
                    <a href={exp.document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                      <FileText size={12} /> View Document
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <a href={`/admin/timeline?edit=experience&id=${exp.id}`} className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-md transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </a>
                  <form action={deleteExperience}>
                    <input type="hidden" name="id" value={exp.id} />
                    <button type="submit" className="text-destructive hover:bg-destructive/10 p-2 rounded-md"><Trash2 size={16}/></button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
 
        {/* EDUCATION SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold border-b border-border pb-2">
            <GraduationCap className="text-primary" /> Education
          </div>
          
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
            <form action={addEducation} className="space-y-4">
              <input type="text" name="institution" placeholder="Institution Name" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
              <input type="text" name="degree" placeholder="Degree / Certificate" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="date" name="start_date" className="p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                <input type="date" name="end_date" placeholder="End Date" className="p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                <input type="text" name="grade" placeholder="Grade / CGPA" className="p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="field_of_study" placeholder="Field of study (e.g. Computer Science)" className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
                <textarea name="description" placeholder="Activities or details..." rows={2} className="w-full p-2 rounded border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Degree / Document Certificate</label>
                <FileInput name="document" accept="image/*,application/pdf" className="w-full text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" label="Max size: 10MB." />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Education
              </button>
            </form>
          </div>
 
          <div className="space-y-3">
            {education?.map(edu => (
              <div key={edu.id} className="flex justify-between items-start p-4 bg-card border border-border rounded-lg shadow-sm">
                <div>
                  <h4 className="font-bold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  {edu.document_url && (
                    <a href={edu.document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                      <FileText size={12} /> View Document
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <a href={`/admin/timeline?edit=education&id=${edu.id}`} className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-md transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </a>
                  <form action={deleteEducation}>
                    <input type="hidden" name="id" value={edu.id} />
                    <button type="submit" className="text-destructive hover:bg-destructive/10 p-2 rounded-md"><Trash2 size={16}/></button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
 
        {/* CERTIFICATIONS SECTION */}
        <section className="space-y-6 lg:col-span-2 xl:col-span-2">
          <div className="flex items-center gap-2 text-xl font-bold border-b border-border pb-2">
            <Award className="text-primary" /> Certifications
          </div>
          
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm max-w-3xl">
            <form action={addCertification} className="space-y-4">
              <div className="flex gap-4">
                <input type="text" name="title" placeholder="Certification Title" className="flex-1 p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                <input type="text" name="issuer" placeholder="Issuer (e.g. Google)" className="flex-1 p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
              </div>
              <div className="flex gap-4">
                <input type="date" name="issue_date" className="flex-1 p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                <input type="url" name="credential_url" placeholder="Credential URL (Optional)" className="flex-1 p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Certification Document / Certificate</label>
                <FileInput name="document" accept="image/*,application/pdf" className="w-full text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" label="Max size: 10MB." />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Certification
              </button>
            </form>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications?.map(cert => (
              <div key={cert.id} className="flex flex-col justify-between p-4 bg-card border border-border rounded-lg shadow-sm">
                <div className="mb-4">
                  <h4 className="font-bold">{cert.title}</h4>
                  <p className="text-sm text-primary font-medium">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">Issued: {cert.issue_date}</p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                  <div className="flex flex-col gap-1 align-start">
                    {cert.credential_url && (
                      <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs font-medium hover:underline text-primary">View Credential Link</a>
                    )}
                    {cert.document_url && (
                      <a href={cert.document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium hover:underline text-primary">
                        <FileText size={12} /> View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <a href={`/admin/timeline?edit=certification&id=${cert.id}`} className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-md transition-colors" title="Edit">
                      <Edit2 size={14} />
                    </a>
                    <form action={deleteCertification}>
                      <input type="hidden" name="id" value={cert.id} />
                      <button className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md"><Trash2 size={14}/></button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
 
      </div>
    </div>
  )
}
