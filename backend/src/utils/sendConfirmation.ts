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
  
  📅 Fecha: ${booking.date.toLocaleString()}
  👤 Profesional: ${booking.professional?.name}
  💇 Servicio: ${booking.service?.name}
  
  Gracias por reservar con ${company.businessName}.
  
  Si tienes dudas, responde a este correo.
  
  Saludos,
  ${company.businessName}
  `,
    };
  
    await transporter.sendMail(mailOptions);
  }
  