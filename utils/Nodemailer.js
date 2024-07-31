const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // List of receivers
      subject: "Email Verification", // Subject line
      html: `<p>Please verify your email by clicking <a href="http://localhost:5173/verify-email?token=${verificationToken}">here</a>.</p>`, // HTML body content
    };

    // Log the mailOptions to verify their content
    console.log("Mail options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    // Log the response from the email server
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = sendVerificationEmail;
