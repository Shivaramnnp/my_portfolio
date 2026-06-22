"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, X } from "lucide-react"

interface ToastProps {
  message: string
  duration?: number
  type?: "success" | "info" | "error"
}

export function Toast({ message, duration = 4000, type = "success" }: ToastProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      // Clean up search params so reloading doesn't keep showing the toast
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.delete("saved")
        url.searchParams.delete("deleted")
        window.history.replaceState({}, "", url.pathname)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const bgColors = {
    success: "bg-green-500 border-green-400/20 text-white",
    info: "bg-blue-500 border-blue-400/20 text-white",
    error: "bg-red-500 border-red-400/20 text-white"
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border ${bgColors[type]}`}
        >
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="text-sm font-semibold">{message}</span>
          <button 
            onClick={() => {
              setShow(false)
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href)
                url.searchParams.delete("saved")
                url.searchParams.delete("deleted")
                window.history.replaceState({}, "", url.pathname)
              }
            }} 
            className="p-0.5 hover:bg-white/10 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
