'use client'

import { useTheme } from '@/context/theme-context'
import type React from 'react'

interface ThemedBadgeProps {
  children: React.ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

export function ThemedBadge({
  children,
  variant = 'primary',
  size = 'sm',
  className = ''
}: ThemedBadgeProps) {
  const { currentTheme } = useTheme()

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: currentTheme.colors.primaryLight,
          color: currentTheme.colors.primaryDark
        }
      case 'secondary':
        return {
          backgroundColor: currentTheme.colors.primaryLight,
          color: currentTheme.colors.primary
        }
      case 'success':
        return {
          backgroundColor: '#dcfce7', // green-100
          color: currentTheme.colors.success
        }
      case 'warning':
        return {
          backgroundColor: '#fef3c7', // amber-100
          color: currentTheme.colors.warning
        }
      case 'error':
        return {
          backgroundColor: '#fee2e2', // red-100
          color: currentTheme.colors.error
        }
      case 'neutral':
        return {
          backgroundColor: currentTheme.colors.border,
          color: currentTheme.colors.textSecondary
        }
      default:
        return {}
    }
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${className}`}
      style={getVariantStyles() as React.CSSProperties}
    >
      {children}
    </span>
  )
}
