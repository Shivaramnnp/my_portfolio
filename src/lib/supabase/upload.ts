import { createClient } from "@/lib/supabase/server"

/**
 * Uploads a file from a Server Action FormData to Supabase Storage.
 * @param file The File object from formData.get()
 * @param folder The folder inside the bucket (e.g. 'avatars', 'projects')
 * @returns The public URL of the uploaded file, or null if no file was uploaded
 */
export async function uploadFile(file: File | null, folder: string): Promise<string | null> {
  if (!file || file.size === 0 || !file.name) {
    return null
  }

  const supabase = await createClient()
  const fileExt = file.name.split('.').pop()
  // Generate unique filename
  const fileName = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

  // Convert File to ArrayBuffer for uploading on the server
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    console.error("Storage upload error:", error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('portfolio')
    .getPublicUrl(fileName)

  return publicUrl
}
