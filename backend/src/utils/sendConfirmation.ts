import { transporter } from "../lib/email";

export async function sendConfirmationBooking({ booking, company }: any) {
  const mailOptions = {
    from: `"${company.businessName}" <${process.env.EMAIL_SENDER}>`,
    to: booking.email,
    replyTo: company.email,
    subject: `Confirmación de tu reserva en ${company.businessName}`,
    text: `
Hola ${booking.name},

Tu reserva ha sido confirmada:

📅 Fecha: ${booking.date.toLocaleString('es-ES')}
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
