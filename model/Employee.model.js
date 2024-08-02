const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeename: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["employee", "manager", "admin"],
    default: "employee",
  },
  assigned_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager", // Reference to Manager schema
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Reference to Task schema
    },
  ],
});

module.exports = mongoose.model("Employee", employeeSchema);
