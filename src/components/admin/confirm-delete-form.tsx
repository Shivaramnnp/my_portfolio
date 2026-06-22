"use client"

import { Trash2 } from "lucide-react"

interface ConfirmDeleteFormProps {
  action: (formData: FormData) => Promise<void>
  categoryName: string
}

export function ConfirmDeleteForm({ action, categoryName }: ConfirmDeleteFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category and all its skills?`)) {
      e.preventDefault()
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="category" value={categoryName} />
      <button 
        type="submit" 
        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" 
        title="Delete Category"
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}
