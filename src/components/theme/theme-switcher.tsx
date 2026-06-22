"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Zap } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-2 border border-border p-1 rounded-full bg-card">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-colors ${theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
        aria-label="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
        aria-label="Dark Mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme("cyberpunk")}
        className={`p-2 rounded-full transition-colors ${theme === "cyberpunk" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
        aria-label="Cyberpunk Mode"
      >
        <Zap size={16} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-colors ${theme === "system" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
        aria-label="System Theme"
      >
        <Monitor size={16} />
      </button>
    </div>
  )
}
