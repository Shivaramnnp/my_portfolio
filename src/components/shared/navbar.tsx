import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { createClient } from "@/lib/supabase/server"

export async function Navbar() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('os_name').limit(1).single()
  const osName = profile?.os_name || "ShivaOS"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {osName}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/stack" className="transition-colors hover:text-foreground text-foreground/60">Stack</Link>
            <Link href="/recruiter" className="transition-colors hover:text-foreground text-foreground/60">Recruiter</Link>
            <Link href="/resume" className="transition-colors hover:text-foreground text-foreground/60">Resume</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
