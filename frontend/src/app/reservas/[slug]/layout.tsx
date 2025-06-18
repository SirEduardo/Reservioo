import type React from "react"
export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Hacer una Reserva</title>
        <meta name="description" content="Reserva tu cita de forma rápida y sencilla" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
