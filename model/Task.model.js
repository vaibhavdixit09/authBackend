const mongoose = require("mongoose");
const Employee = require("./Employee.model");
const taskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["urgent", "moderate", "lessimportant"],
    default: "moderate",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});
module.exports = mongoose.model("Task", taskSchema);
