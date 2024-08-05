const Task = require("../model/Task.model");
const Employee = require("../model/Employee.model");

const CreateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, owner, assignedTo } =
      req.body;
    console.log("Request body:", req.body); // Log request body for debugging

    // Validate required fields
    if (!owner) {
      return res.status(400).json({ message: "Missing required owner" });
    }
    if (!title) {
      return res.status(400).json({ message: "Missing required title" });
    }
    if (!dueDate) {
      return res.status(400).json({ message: "Missing required dueDate" });
    }
    if (!priority) {
      return res.status(400).json({ message: "Missing required priority" });
    }

    // Create and save new task
    const newTask = new Task({
      owner,
      title,
      description,
      dueDate,
      priority,
    });

    await newTask.save();

    res.status(201).json({ message: "Task added", newTask });
  } catch (err) {
    console.error("Error in creating task:", err);
    res
      .status(500)
      .json({ message: "Error in creating task", error: err.message });
  }
};

const GetAllTasks = async (req, res) => {
  try {
    const allTask = await Task.find({});
    if (!allTask) {
      res.status(404).json({ message: "Nothing to show", value: 0 });
    }
    res.status(200).json({
      message: "tasks fetched success",
      value: allTask.length,
      allTask,
    });
  } catch (err) {
    res.status(400).json({ message: "servor error in getting tasks", err });
  }
};

const DeleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find and delete the task
    const result = await Task.findByIdAndDelete(taskId);

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the task reference from Employee documents
    await Employee.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { DeleteTask };

const GetManagerTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const allManagerTasks = await Task.find({ owner: id });
    if (!allManagerTasks) {
      res
        .status(404)
        .json({ message: "No task found", values: allManagerTasks.length });
    }
    res.status(200).json({
      message: "found success",
      values: allManagerTasks.length,
      allManagerTasks,
    });
  } catch (err) {
    res.status(200).json({
      message: "server error",
      err,
    });
  }
};

const AssignTask = async (req, res) => {
  const { taskId, employeeId } = req.body;

  try {
    // Check if both task and employee exist
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Add the task to the employee's tasks array
    await Employee.findByIdAndUpdate(
      employeeId,
      { $addToSet: { tasks: taskId } }, // Using $addToSet to avoid duplicates
      { new: true }
    );

    // Optionally, you might want to update the task to reflect the assignment
    await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { assignedTo: employeeId } }, // Add employee to the assignedTo array
      { new: true }
    );

    res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  CreateTask,
  GetAllTasks,
  DeleteTask,
  GetManagerTasks,
  AssignTask,
};
