import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import sendEmail from "../utils/sendEmail.js";
import sendOTP from "../utils/sendOtp.js";

// SIGNUP
// SIGNUP - Optimized for Response Speed
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    sendEmail(
      email,
      "Signup Successful",
      `Hi ${name}, your account has been created successfully.`
    ).catch(err => console.error("Signup email failed:", err.message));

    return res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await user.save();

    // 🔥 DO NOT AWAIT
    sendOTP(user.phone, otp).catch(err =>
      console.error("OTP send failed:", err.message)
    );

    return res.json({ message: "OTP sent to your phone" });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // 🔥 DO NOT AWAIT
    sendEmail(
      user.email,
      "Login Successful",
      "You have successfully logged in."
    ).catch(err =>
      console.error("Login email failed:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
