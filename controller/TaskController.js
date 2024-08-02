const Employee = require("../model/Employee.model");
const Task = require("../model/Task.model");

const CreateTask = async (req, res) => {
  try {
    let { title, description, dueDate, status, assignedTo } = req.body;

    // Convert dueDate to ISO format if it's in "dd-MM-yyyy"
    if (dueDate && !dueDate.includes("T")) {
      const [day, month, year] = dueDate.split("-");
      dueDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      assignedTo,
    });

    await newTask.save(); // Await the save operation
    // Update the employee's tasks array
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      throw new Error("Employee not found");
    }

    employee.tasks.push(newTask._id);
    await employee.save();

    res.status(201).json({ message: "Task added", newTask });
  } catch (err) {
    console.log("Error in creating task", err);
    res.status(400).json({
      message: "Error in creating task",
      error: err.message, // Include error message for debugging (remove in production)
    });
  }
};

module.exports = CreateTask;
