const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  managername: {
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
  assigned_employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to Employee schema
    },
  ],
});

module.exports = mongoose.model("Manager", managerSchema);
