import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    // Explicitly use the host and port instead of the "service" shortcut
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // Must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Force IPv4 by setting family to 4
    // This stops the 'ENETUNREACH' error with IPv6 addresses
    connectionTimeout: 15000, 
    socketTimeout: 15000,
    tls: {
      // This ensures the connection doesn't fail on local network issues
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};

export default sendEmail;