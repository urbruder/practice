import nodemailer from "nodemailer";
import { google } from "googleapis";

const sendEmail = async (to, subject, text) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    // 1. Fetch the token explicitly to ensure the handshake works
    const { token } = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      // 2. Do NOT use 'service: gmail' here if port errors persist. 
      // Instead, use host/port 587 which is more cloud-friendly.
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: token,
      },
      // 3. FORCE IPv4 to stop the ENETUNREACH error
      family: 4 
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully via OAuth2 & IPv4");
  } catch (error) {
    console.error("❌ Gmail API Error Details:", error);
    throw error;
  }
};

export default sendEmail;