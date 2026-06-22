import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Resume | Shivaram Nunugonda",
  description: "Professional Resume",
}

export default async function PublicResumePage() {
  const supabase = await createClient()

  // Find the public default variant
  const { data: defaultVariant } = await supabase
    .from('resume_variants')
    .select('id')
    .eq('is_public_default', true)
    .single()

  if (defaultVariant) {
    // Redirect to the actual variant page to reuse the rendering logic
    redirect(`/resume/variants/${defaultVariant.id}`)
  } else {
    // Fallback if no default is set
    redirect(`/resume/variants/default`)
  }
}
