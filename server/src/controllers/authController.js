import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import sendEmail from "../utils/sendEmail.js";
import sendOTP from "../utils/sendOtp.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, phone, password: hashedPassword });

    // Await ensures the email is sent before the response is sent to frontend
    try {
      await sendEmail(email, "Signup Successful", `Hi ${name}, welcome!`);
    } catch (e) {
      console.error("Signup email failed in background");
    }

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Await this to ensure Twilio finishes before the server closes the request
    await sendOTP(user.phone, otp);

    return res.json({ message: "OTP sent to your phone" });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Failed to send OTP. Check if number is verified." });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== String(otp) || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    await sendEmail(user.email, "Login Successful", "You have logged in successfully.");

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
// LOGOUT
export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
