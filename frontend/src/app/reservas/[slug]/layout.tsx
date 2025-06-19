import type React from 'react'
export default function ReservasLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      {children}
    </div>
  )
}
