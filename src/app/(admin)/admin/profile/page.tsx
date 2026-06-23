import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { uploadFile } from "@/lib/supabase/upload"
import { redirect } from "next/navigation"
import { Toast } from "@/components/admin/toast"
import { ProfileForm } from "@/components/admin/profile-form"

export default async function ProfileManagementPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const params = await searchParams
  const isSaved = params.saved === "true"

  const supabase = await createClient()
  
  // Fetch current profile
  const { data: profile } = await supabase.from('profiles').select('*').limit(1).single()

  async function updateProfile(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const full_name = formData.get("full_name") as string
    const title = formData.get("title") as string
    const bio = formData.get("bio") as string
    const email = formData.get("email") as string
    const os_name = formData.get("os_name") as string || "ShivaOS"
    const welcome_message = formData.get("welcome_message") as string
    const availability_status = formData.get("availability_status") as string
    const avatarFile = formData.get("avatar") as File | null
    const removeAvatar = formData.get("remove_avatar") === "on"

    // Fetch current profile to keep avatar if not changed
    const { data: currentProfile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()

    let avatarUrl = currentProfile?.avatar_url || null

    if (removeAvatar) {
      avatarUrl = null
    } else if (avatarFile && avatarFile.size > 0) {
      avatarUrl = await uploadFile(avatarFile, "avatars")
    }

    // Upsert profile data
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name,
      title,
      bio,
      email,
      avatar_url: avatarUrl,
      os_name,
      welcome_message,
      availability_status,
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.error("Error upserting profile:", error)
      throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect("/admin/profile?saved=true")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {isSaved && <Toast message="Profile saved successfully!" />}
      <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
      
      <ProfileForm profile={profile} updateProfile={updateProfile} />
    </div>
  )
}
