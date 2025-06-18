"use client"

import { useTheme } from "@/context/theme-context"
import type React from "react"

import { type SelectHTMLAttributes, forwardRef } from "react"

interface ThemedSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: React.ReactNode
}

export const ThemedSelect = forwardRef<HTMLSelectElement, ThemedSelectProps>(
  ({ label, className = "", style, children, ...props }, ref) => {
    const { currentTheme } = useTheme()

    const selectStyles = {
      borderColor: currentTheme.colors.border,
      backgroundColor: currentTheme.colors.surface,
      color: currentTheme.colors.text,
      ...style,
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium" style={{ color: currentTheme.colors.text }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${className}`}
          style={{
            ...selectStyles,
            "--tw-ring-color": currentTheme.colors.primaryLight,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = currentTheme.colors.primary
            e.target.style.boxShadow = `0 0 0 3px ${currentTheme.colors.primaryLight}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = currentTheme.colors.border
            e.target.style.boxShadow = "none"
          }}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  },
)

ThemedSelect.displayName = "ThemedSelect"
