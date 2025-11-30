import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  // smtp.gmail.com
  port: process.env.EMAIL_PORT,  // 465
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // your 16-char app password
  },
});
export default transporter;
