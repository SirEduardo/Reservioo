'use client'

import { useTheme } from '@/context/theme-context'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const ThemedInput = forwardRef<HTMLInputElement, ThemedInputProps>(
  ({ label, className = '', style, ...props }, ref) => {
    const { currentTheme } = useTheme()

    const inputStyles = {
      borderColor: currentTheme.colors.border,
      backgroundColor: currentTheme.colors.surface,
      color: currentTheme.colors.text,
      ...style
    }

    return (
      <div className="space-y-2">
        {label && (
          <label
            className="block text-sm font-medium"
            style={{ color: currentTheme.colors.text }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${className}`}
          style={
            {
              ...inputStyles,
              '--tw-ring-color': currentTheme.colors.primaryLight
            } as React.CSSProperties
          }
          onFocus={(e) => {
            e.target.style.borderColor = currentTheme.colors.primary
            e.target.style.boxShadow = `0 0 0 3px ${currentTheme.colors.primaryLight}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = currentTheme.colors.border
            e.target.style.boxShadow = 'none'
          }}
          {...props}
        />
      </div>
    )
  }
)

ThemedInput.displayName = 'ThemedInput'
