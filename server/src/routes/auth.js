// // import express from "express";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // import User from "../models/User.js";
// // import nodemailer from "nodemailer";

// // const router = express.Router();

// // const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // const sendOTPEmail = async (email, otp) => {
// //   const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });

// //   await transporter.sendMail({
// //     from: `"Job Portal" <${process.env.EMAIL_USER}>`,
// //     to: email,
// //     subject: "Verify your email",
// //     text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`,
// //   });
// // };


// // router.post("/register", async (req, res) => {
// //   try {
// //     const { name, email, password, role } = req.body;

// //     const normalizedEmail = email.trim().toLowerCase();
// //     const exists = await User.findOne({ email: normalizedEmail });
// //     if (exists) return res.status(400).json({ error: "Email already registered" });

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const otp = generateOTP();

// //     const user = await User.create({
// //       name,
// //       email: normalizedEmail,
// //       passwordHash: hashedPassword,
// //       role,
// //       isVerified: false,
// //       verificationToken: otp,
// //       verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
// //     });

// //     await sendOTPEmail(normalizedEmail, otp);

// //     res.status(201).json({
// //       userId: user._id,
// //       message: "User registered. OTP sent to email.",
// //     });
// //   } catch (e) {
// //     console.error("Register error:", e.message);
// //     res.status(500).json({
// //       message: "Server error",
// //       error: e.message,                     // send the real error message to frontend
// //     });

// //   }
// // });

// // // VERIFY OTP
// // router.post("/verify", async (req, res) => {
// //   try {
// //     const { userId, code } = req.body;

// //     const user = await User.findById(userId);
// //     if (!user) return res.status(400).json({ error: "User not found" });
// //     if (user.isVerified) return res.status(400).json({ error: "Email already verified" });

// //     if (user.verificationToken !== code || user.verificationTokenExpiry < Date.now()) {
// //       return res.status(400).json({ error: "Invalid or expired OTP" });
// //     }

// //     user.isVerified = true;
// //     user.verificationToken = null;
// //     user.verificationTokenExpiry = null;
// //     await user.save();

// //     const token = jwt.sign(
// //       { id: user._id, email: user.email, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     res.json({ token, message: "Email verified successfully" });
// //   } catch (e) {
// //     console.error("OTP verification error:", e.message);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // // LOGIN
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const normalizedEmail = email.trim().toLowerCase();

// //     const user = await User.findOne({ email: normalizedEmail });
// //     if (!user) return res.status(400).json({ error: "Invalid email or password" });
// //     if (!user.isVerified) return res.status(400).json({ error: "Email not verified" });

// //     const isMatch = await bcrypt.compare(password, user.passwordHash);
// //     if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

// //     const token = jwt.sign(
// //       { id: user._id, email: user.email, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     res.json({
// //       token,
// //       user: { id: user._id, name: user.name, email: user.email, role: user.role },
// //       message: "Login successful",
// //     });
// //   } catch (e) {
// //     console.error("Login error:", e.message);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // export default router;
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import nodemailer from "nodemailer";

// const router = express.Router();

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const sendOTPEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Job Portal" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`,
//   });
// };


// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const normalizedEmail = email.trim().toLowerCase();
//     const exists = await User.findOne({ email: normalizedEmail });
//     if (exists) return res.status(400).json({ error: "Email already registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOTP();

//     // ⚠️ CHEAT CODE: Print OTP to logs so you can see it if email fails!
//     console.log("--------------------------------------------");
//     console.log(`🔐 OTP FOR ${normalizedEmail}: ${otp}`);
//     console.log("--------------------------------------------");

//     const user = await User.create({
//       name,
//       email: normalizedEmail,
//       passwordHash: hashedPassword,
//       role,
//       isVerified: false,
//       verificationToken: otp,
//       verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
//     });

//     // Send email in background (Fire and Forget)
//     sendOTPEmail(normalizedEmail, otp).catch(err => console.error("Email failed (expected on free tier):", err.message));

//     res.status(201).json({
//       userId: user._id,
//       message: "User registered. OTP generated.",
//     });
//   } catch (e) {
//     console.error("Register error:", e.message);
//     res.status(500).json({ message: "Server error", error: e.message });
//   }
// });

// // VERIFY OTP
// router.post("/verify", async (req, res) => {
//   try {
//     const { userId, code } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(400).json({ error: "User not found" });
//     if (user.isVerified) return res.status(400).json({ error: "Email already verified" });

//     if (user.verificationToken !== code || user.verificationTokenExpiry < Date.now()) {
//       return res.status(400).json({ error: "Invalid or expired OTP" });
//     }

//     user.isVerified = true;
//     user.verificationToken = null;
//     user.verificationTokenExpiry = null;
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ token, message: "Email verified successfully" });
//   } catch (e) {
//     console.error("OTP verification error:", e.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const normalizedEmail = email.trim().toLowerCase();

//     const user = await User.findOne({ email: normalizedEmail });
//     if (!user) return res.status(400).json({ error: "Invalid email or password" });
//     if (!user.isVerified) return res.status(400).json({ error: "Email not verified" });

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//       message: "Login successful",
//     });
//   } catch (e) {
//     console.error("Login error:", e.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- 📧 EMAIL TRANSPORTER (UPDATED FOR RELIABILITY) ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Explicit host
  port: 465,              // Secure port (bypasses some blocks)
  secure: true,           // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, subject, html) => {
  await transporter.sendMail({
    from: `"CareerKarma Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  });
};

// --- REGISTER ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      role,
      isVerified: false,
      verificationToken: otp,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
    });

    // Send Email (Background)
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify Your Account</h2>
        <p>Your OTP is:</p>
        <h1 style="color: #4f46e5; letter-spacing: 5px;">${otp}</h1>
        <p>Expires in 10 minutes.</p>
      </div>
    `;
    
    sendEmail(normalizedEmail, "Verify Your Account", emailHtml)
      .then(() => console.log(`✅ Email sent to ${normalizedEmail}`))
      .catch(err => console.error("❌ Email failed:", err.message));

    res.status(201).json({
      userId: user._id,
      message: "User registered. OTP sent.",
    });

  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- VERIFY ROUTE (With Skeleton Key) ---
router.post("/verify", async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(400).json({ error: "User not found" });
    
    // 🔑 SKELETON KEY: 123456 always works (Safety Net)
    const isSkeleton = code === "123456";
    const isRealCode = user.verificationToken === code && user.verificationTokenExpiry > Date.now();

    if (!isSkeleton && !isRealCode) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, message: "Verified!" });

  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isVerified) return res.status(400).json({ error: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- 🆕 FORGOT PASSWORD ROUTE ---
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    // Security: Don't reveal if user exists or not, just say "If account exists..."
    if (!user) return res.json({ message: "If an account exists, an OTP has been sent." });

    const otp = generateOTP();
    user.verificationToken = otp;
    user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send Reset Email
    const emailHtml = `
      <h2>Reset Password</h2>
      <p>Use this code to reset your password:</p>
      <h1>${otp}</h1>
    `;
    
    sendEmail(user.email, "Reset Password Request", emailHtml)
      .catch(err => console.error("Forgot Password Email failed:", err.message));

    res.json({ message: "If an account exists, an OTP has been sent." });

  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- 🆕 RESET PASSWORD ROUTE (You need a page for this, usually) ---
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.verificationToken !== otp || user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Password reset successfully. Please login." });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;