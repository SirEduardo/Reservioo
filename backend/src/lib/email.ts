import nodemailer from 'nodemailer'

console.log('EMAIL_SENDER:', process.env.EMAIL_SENDER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'MISSING');

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASS,
    },
})