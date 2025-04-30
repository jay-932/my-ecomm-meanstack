const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

async function createTestTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  console.log("🔐 Ethereal Test Account Created:");
  console.log("Login:", testAccount.user);
  console.log("Password:", testAccount.pass);

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// ✅ Register User with Validation
async function registerUser(userData) {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    throw new Error(`Missing fields: ${missing.join(", ")}`);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists.Please enter another email");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    isAdmin: userData.isAdmin || false
  });

  await user.save();
  return user;
}

// ✅ Login User with Validation
async function loginUser(userData) {
    const { email, password } = userData;
  
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email is not registered");
    }
  
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new Error("Incorrect password");
    }
  
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      "seceret", // ⚠️ Replace with env var in production
      { expiresIn: "1h" }
    );
  
    return { token, user };
  }
  

// ✅ Forgot Password
async function forgotPassword(email) {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetLink = `http://localhost:4200/reset-password/${token}`;
  const transporter = await createTestTransporter();

  const info = await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`
  });

  const previewLink = nodemailer.getTestMessageUrl(info);
  return { message: "Reset password link sent to your email", previewLink };
}

// ✅ Reset Password
async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error("Token and new password are required");
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return "Password has been reset successfully";
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  createTestTransporter
};
