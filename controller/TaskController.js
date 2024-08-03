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
      assignedTo,
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
    const result = await Task.findByIdAndDelete(taskId);

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
module.exports = { CreateTask, GetAllTasks, DeleteTask, GetManagerTasks };
