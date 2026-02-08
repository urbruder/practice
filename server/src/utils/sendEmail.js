import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, // Standard for cloud environments
    secure: false, // Must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // 16-digit App Password
    },
    // Increase timeouts for slow production connections
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};

export default sendEmail;