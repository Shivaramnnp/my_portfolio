"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow hover:bg-primary/90 transition-colors cursor-pointer"
    >
      <Printer size={16} /> Print / Save PDF
    </button>
  )
}
