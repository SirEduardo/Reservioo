"use client"

import { useTheme } from "@/context/theme-context"
import type React from "react"

import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, disabled, style, ...props }, ref) => {
    const { currentTheme } = useTheme()

    const baseClasses =
      "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation"

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    }

    const getVariantStyles = () => {
      if (disabled) {
        return {
          backgroundColor: currentTheme.colors.border,
          color: currentTheme.colors.textSecondary,
          cursor: "not-allowed",
          opacity: "0.6",
        }
      }

      switch (variant) {
        case "primary":
          return {
            background: currentTheme.gradients.primary,
            color: "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }
        case "secondary":
          return {
            backgroundColor: currentTheme.colors.secondary,
            color: "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }
        case "outline":
          return {
            backgroundColor: "transparent",
            color: currentTheme.colors.primary,
            border: `2px solid ${currentTheme.colors.primary}`,
          }
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: currentTheme.colors.primary,
          }
        case "success":
          return {
            backgroundColor: currentTheme.colors.success,
            color: "white",
          }
        case "danger":
          return {
            backgroundColor: currentTheme.colors.error,
            color: "white",
          }
        default:
          return {}
      }
    }

    const variantStyles = getVariantStyles()

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${className} ${!disabled ? "hover:shadow-lg hover:scale-105" : ""}`}
        style={{ ...variantStyles, ...style }}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)

ThemedButton.displayName = "ThemedButton"
