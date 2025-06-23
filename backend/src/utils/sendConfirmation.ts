import { transporter } from "../lib/email";


export async function sendConfirmationBooking({ booking, company }: any) {
    const formattedDate = booking.date.toLocaleString('es-ES', {
        day:'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
  const mailOptions = {
    from: `"${company.businessName}" <${process.env.EMAIL_SENDER}>`,
    to: booking.email,
    replyTo: company.email,
    subject: `Confirmación de tu reserva en ${company.businessName}`,
    text: `
Hola ${booking.name},

Tu reserva ha sido confirmada:

📅 Fecha: ${formattedDate}
👤 Profesional: ${booking.professional?.name || 'Por confirmar'}
💇 Servicio: ${booking.service?.name}

Gracias por reservar con ${company.businessName}.

Si tienes dudas o necesitas cancelar, responde a este correo o llámanos al 📞 ${company.phone}.

Saludos,
${company.businessName}
    `,
  };

  await transporter.sendMail(mailOptions);
}
