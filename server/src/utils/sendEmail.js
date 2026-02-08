import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Port 587 is much more reliable on Render than 465
      secure: false, // Must be false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // THIS IS THE FIX: Forces IPv4 to bypass the ENETUNREACH error
      family: 4, 
      connectionTimeout: 20000, // 20 seconds to allow for Render's slow network starts
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    // If it still fails, this will log the specific IPv4 error
    console.error("❌ Email error:", error.message);
  }
};

export default sendEmail;