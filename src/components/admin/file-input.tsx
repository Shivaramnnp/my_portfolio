"use client"

import { useState, useRef } from "react"
import { AlertTriangle } from "lucide-react"

interface FileInputProps {
  name: string
  accept?: string
  id?: string
  required?: boolean
  maxSizeBytes?: number
  className?: string
  label?: string
}

export function FileInput({
  name,
  accept,
  id,
  required = false,
  maxSizeBytes = 10 * 1024 * 1024, // Default 10MB
  className = "w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90",
  label
}: FileInputProps) {
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxMb = maxSizeBytes / (1024 * 1024)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (file && file.size > maxSizeBytes) {
      setError(`File exceeds the ${maxMb}MB limit. Please choose a smaller file.`)
      if (inputRef.current) {
        inputRef.current.value = "" // Clear the invalid file selection
      }
    }
  }

  return (
    <div className="space-y-1.5 w-full">
      <input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        required={required}
        onChange={handleChange}
        className={className}
      />
      {error ? (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-pulse">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        label && (
          <p className="text-xs text-muted-foreground">
            {label}
          </p>
        )
      )}
    </div>
  )
}
