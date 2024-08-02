const jwt = require("jsonwebtoken");
const Employee = require("../model/Employee.model");
const Manager = require("../model/Manager.model");
const sendVerificationEmail = require("../utils/Nodemailer");

const resendVerificationEmail = async (req, res) => {
  const userId = req.user.id; // Get user ID from the request

  try {
    // Attempt to find the user in both collections
    let user = await Employee.findById(userId);
    if (!user) {
      user = await Manager.findById(userId);
    }

    // If user is not found in either collection
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { resendVerificationEmail };
