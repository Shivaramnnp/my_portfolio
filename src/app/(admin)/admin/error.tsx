"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin dashboard error captured by boundary:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6 text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
          <AlertCircle size={32} />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while processing this page. If you were uploading a file, it might have exceeded server or storage limits.
          </p>
          {error.message && (
            <div className="mt-3 p-3 bg-muted/50 border border-border rounded-lg text-left text-xs font-mono text-muted-foreground break-all max-h-32 overflow-y-auto">
              {error.message}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw size={16} /> Try Again
          </button>
          <Link
            href="/admin/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-card text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
          >
            <Home size={16} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
