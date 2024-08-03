const express = require("express");
const jwt = require("jsonwebtoken");
const { signup, login, fetchUser } = require("../controller/AuthController");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const Employee = require("../model/Employee.model");
const Manager = require("../model/Manager.model");
const {
  resendVerificationEmail,
} = require("../controller/VerificationController");
const {
  fetchAllEmp,
  updateEmployee,
  fetchUserFromId,
} = require("../controller/EmployeeController");
const {
  CreateTask,
  DeleteTask,
  GetManagerTasks,
} = require("../controller/TaskController");
const { GetAllTasks } = require("../controller/TaskController");
const router = express.Router();

router.post("/login", login);
router.post("/Signup", signup);
router.get("/user-details", AuthenticateToken, fetchUser);
router.post("/resend-verification", AuthenticateToken, resendVerificationEmail);
router.get("/get-all/:type", fetchAllEmp);
router.get("/get-user/:id", fetchUserFromId);
router.get("/get-manager-task/:id", GetManagerTasks);
router.put("/update/:id", updateEmployee);
router.delete("/delete-task/:id", DeleteTask);
router.post("/create-task", CreateTask);
router.get("/get-all-tasks", GetAllTasks);

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and update verification status
    const user = await Employee.findById(decoded.id);
    if (!user) {
      user = await Manager.findById(decoded.id);
    }
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
