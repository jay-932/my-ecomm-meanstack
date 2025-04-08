const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ✅ Create test email transporter (using Ethereal)

//Ethereal email (what you're using now) is meant only for development & testing — NOT for production.

///For production, you should switch to a real email service:
//Here are some reliable options:

//Provider	Free Tier?	Notes
//Gmail SMTP	✅ (limited)	Use App Passwords if 2FA enabled
//SendGrid	✅ (100/day)	Great for transactional email
//Mailgun	✅ (trial)	Dev-friendly, easy to integrate
//Brevo (ex-SendinBlue)	✅	Good for small apps
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
            rejectUnauthorized: false  // ✅ Fix for self-signed cert
        }
    });
}


// ✅ Register User
async function registerUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
    });

    await user.save();
    return user;
}

// ✅ Login User
async function loginUser(userData) {
    const user = await User.findOne({ email: userData.email });
    if (!user) return null;

    const isMatched = await bcrypt.compare(userData.password, user.password);
    if (!isMatched) return null;

    const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        "seceret", // ⛔️ Use env var in prod
        { expiresIn: "1h" }
    );

    return { token, user };
}

// ✅ Forgot Password
async function forgotPassword(email) {
    try {
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
  
      const previewLink = nodemailer.getTestMessageUrl(info); // 👈 Return this too!
      return { message: "Reset password link sent to your email", previewLink };
    } catch (error) {
      console.error("❌ Error in forgotPassword:", error.message);
      throw error;
    }
  }
  

// ✅ Reset Password
async function resetPassword(token, newPassword) {
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
