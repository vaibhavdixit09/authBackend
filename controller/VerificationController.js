const jwt = require("jsonwebtoken");
const User = require("../model/User");
const sendVerificationEmail = require("../utils/Nodemailer");

const resendVerificationEmail = async (req, res) => {
  const userId = req.user.id; // Get user ID from the request

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const verificationToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { resendVerificationEmail };
