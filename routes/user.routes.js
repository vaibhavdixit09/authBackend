const express = require("express");
const jwt = require("jsonwebtoken");
const { login, signup, fetchUser } = require("../controller/AuthController");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const {
  resendVerificationEmail,
} = require("../controller/VerificationController");
const User = require("../model/User");
const {
  fetchAllEmp,
  updateEmployee,
} = require("../controller/EmployeeController");
const router = express.Router();

router.post("/login", login);
router.post("/Signup", signup);
router.get("/user-details", AuthenticateToken, fetchUser);
router.post("/resend-verification", AuthenticateToken, resendVerificationEmail);
router.get("/get-all/:type", fetchAllEmp);
router.put("/update/:id", updateEmployee);

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and update verification status
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.isVerified) {
      return res.status(200).send("Email already verified");
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send("Email verification successful");
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).send("Invalid or expired token");
  }
});
module.exports = router;
