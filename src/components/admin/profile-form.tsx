"use client"

import { useState, useTransition, useRef } from "react"
import { Save, AlertTriangle, AlertCircle } from "lucide-react"
import { getProxiedImageUrl } from "@/lib/utils"

interface Profile {
  id: string
  full_name: string | null
  title: string | null
  bio: string | null
  email: string | null
  avatar_url: string | null
  os_name: string | null
  welcome_message?: string | null
  availability_status?: string | null
}


interface ProfileFormProps {
  profile: Profile | null
  updateProfile: (formData: FormData) => Promise<void>
}

export function ProfileForm({ profile, updateProfile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Client-side file size validation (max 10MB)
    const avatarFile = formData.get("avatar") as File | null
    if (avatarFile && avatarFile.size > 10 * 1024 * 1024) {
      setError("Profile photo exceeds the 10MB file size limit. Please choose a smaller image or compress it.")
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Reset file input
      }
      return
    }

    startTransition(async () => {
      try {
        await updateProfile(formData)
      } catch (err: any) {
        // Let Next.js redirect propagation work
        if (
          err.message && (
            err.message.includes("NEXT_REDIRECT") || 
            err.digest?.startsWith("NEXT_REDIRECT")
          )
        ) {
          throw err
        }
        console.error("Profile save error:", err)
        setError(err.message || "An unexpected error occurred while saving the profile.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm font-medium leading-relaxed">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="block text-sm font-medium">Full Name</label>
          <input 
            type="text" 
            id="full_name" 
            name="full_name" 
            defaultValue={profile?.full_name || ""} 
            className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
            required 
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">Public Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            defaultValue={profile?.email || ""} 
            className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
            required 
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="os_name" className="block text-sm font-medium">OS / Brand Name (Website Branding)</label>
        <input 
          type="text" 
          id="os_name" 
          name="os_name" 
          defaultValue={profile?.os_name || "ShivaOS"} 
          placeholder="e.g. ShivaOS" 
          className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          required 
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">This name is displayed in the sidebar, header, footer, and page metadata.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="welcome_message" className="block text-sm font-medium">Welcome Message (Homepage Top Text)</label>
        <input 
          type="text" 
          id="welcome_message" 
          name="welcome_message" 
          defaultValue={profile?.welcome_message || ""} 
          placeholder="e.g. WELCOME TO MY DIGITAL WORKSPACE" 
          className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">Monospace uppercase text displayed at the top of the homepage hero section.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="availability_status" className="block text-sm font-medium">Availability Status (Badge Text)</label>
        <input 
          type="text" 
          id="availability_status" 
          name="availability_status" 
          defaultValue={profile?.availability_status || ""} 
          placeholder="e.g. Available for Internship · Summer 2026" 
          className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">Text displayed inside the glowing availability green-dot badge.</p>
      </div>


      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">Professional Title</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          defaultValue={profile?.title || ""} 
          placeholder="e.g. B.Tech CS (AI & ML) | Android Developer" 
          className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
          required 
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium">Bio (About Me)</label>
        <textarea 
          id="bio" 
          name="bio" 
          rows={5} 
          defaultValue={profile?.bio || ""} 
          className="w-full p-2.5 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-y" 
          required 
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="avatar" className="block text-sm font-medium">Profile Photo</label>
        <div className="flex flex-col gap-3">
          {profile?.avatar_url && (
            <div className="flex items-center gap-4">
              <img 
                src={getProxiedImageUrl(profile.avatar_url)} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border border-border" 
              />
              <label className="flex items-center gap-2 text-sm text-destructive font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  name="remove_avatar" 
                  className="w-4 h-4 rounded" 
                  disabled={isPending}
                /> Remove Current Photo
              </label>
            </div>
          )}
          <input 
            type="file" 
            id="avatar" 
            name="avatar" 
            ref={fileInputRef}
            accept="image/*" 
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50" 
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle size={12} className="text-amber-500" />
            Max file size: 10MB.
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70 cursor-pointer"
        >
          <Save size={18} />
          {isPending ? "Saving Profile..." : "Save Profile"}
        </button>
      </div>
    </form>
  )
}
