const Employee = require("../model/Employee.model");
const Manager = require("../model/Manager.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async (req, res) => {
  const { username, email, password, phone, isVerified, role } = req.body;

  try {
    // Check if user already exists
    if (role === "manager") {
      const existingUser = await Manager.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Manager({
        managername: username,
        email,
        password: hashedPassword,
        role,
        phone,
        isVerified,
      });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } else if (role === "employee") {
      const existingUser = await Employee.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new Employee({
        employeename: username,
        email,
        password: hashedPassword,
        role,
        phone,
        isVerified,
      });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in Managers
    let user = await Manager.findOne({ email });
    let userType = "manager";

    // If not found, check in Employees
    if (!user) {
      user = await Employee.findOne({ email });
      userType = "employee";
    }

    // If user is not found in both collections
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchUser = async (req, res) => {
  try {
    // Attempt to find the user as a Manager and populate assigned employees
    let user = await Manager.findById(req.user.id)
      .populate("assigned_employees") // Populating the assigned employees field
      .select("-password"); // Exclude sensitive fields like password

    // If not found as a Manager, try to find the user as an Employee and populate the assigned manager
    if (!user) {
      user = await Employee.findById(req.user.id)
        .populate("assigned_manager", "managername") // Populating the assigned manager field
        .select("-password"); // Exclude sensitive fields like password
    }

    // If no user is found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details
    res.json(user);
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { signup, login, fetchUser };
