import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,      // Standard port for cloud providers
      secure: false,  // Must be false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // 16-digit App Password
      },
      family: 4,      // Forces IPv4 to fix the ENETUNREACH error
      connectionTimeout: 15000, // Allows for slow production handshakes
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Production Email Error:", error.message);
    throw error; 
  }
};

export default sendEmail;