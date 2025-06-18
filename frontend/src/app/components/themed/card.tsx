"use client"

import { useTheme } from "@/context/theme-context"
import type React from "react"



interface ThemedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  style?: React.CSSProperties
}

export function ThemedCard({ children, className = "", hover = false, gradient = false, style = {} }: ThemedCardProps) {
  const { currentTheme } = useTheme()

  const baseStyles = {
    backgroundColor: gradient ? "transparent" : currentTheme.colors.surface,
    backgroundImage: gradient ? currentTheme.gradients.primary : "none",
    border: `1px solid ${currentTheme.colors.border}`,
    color: currentTheme.colors.text,
    ...style
  }

  return (
    <div
      className={`rounded-lg p-6 transition-all duration-200 ${hover ? "hover:shadow-lg hover:scale-101" : ""} ${className}`}
      style={baseStyles}
    >
      {children}
    </div>
  )
}
