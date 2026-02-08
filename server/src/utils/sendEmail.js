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

    // 1. Cleaner way to get the token without the new Promise wrapper
    const { token } = await oauth2Client.getAccessToken();
    
    if (!token) {
      throw new Error("Access token could not be generated. Check if Refresh Token is valid.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: token,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email successfully sent via Gmail API.");
  } catch (error) {
    // 2. Catch the "undefined" by logging the full error
    console.error("❌ Gmail API Error Details:", error.response ? error.response.data : error);
    throw error;
  }
};

export default sendEmail;