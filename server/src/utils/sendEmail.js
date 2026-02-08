import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      // 1. Using the direct IPv4 for smtp.gmail.com to bypass broken IPv6 DNS
      host: "142.251.2.108", 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // 2. Explicitly forcing IPv4 at the socket level
      family: 4, 
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      tls: {
        // 3. Since we use an IP instead of a hostname, we must tell 
        // TLS to expect the gmail hostname for the certificate check
        servername: "smtp.gmail.com",
        rejectUnauthorized: true
      }
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("✅ Production Email Sent via IPv4 to:", to);
  } catch (error) {
    console.error("❌ Production Email Error:", error.message);
    // If the direct IP fails (rare), it might be a Render firewall issue
    throw error;
  }
};

export default sendEmail;