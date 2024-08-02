const mongoose = require("mongoose");
const Employee = require("../model/Employee.model");
const Manager = require("../model/Manager.model");

const fetchAllEmp = async (req, res) => {
  try {
    const { type } = req.params;

    let employees;

    if (type === "employee") {
      employees = await Employee.find({}).populate("assigned_manager");
    } else if (type === "manager") {
      employees = await Manager.find({}).populate("assigned_employees");
      // Transform the manager data to include team information
      employees = employees.map((manager) => ({
        ...manager._doc,
        team: {
          count: manager.assigned_employees.length,
          members: manager.assigned_employees.map((emp) => emp.employeename),
        },
      }));
    } else {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    res
      .status(200)
      .json({ message: "Data fetched successfully", data: employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Error while getting all employees" });
  }
};
const fetchUserFromId = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await Employee.findById(id);
    if (!user) {
      user = await Manager.findById(id);
    }
    if (!user) {
      console.log("no user found to fetch");
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch {
    res.status(500).json({ message: "User not fetched" });
  }
};
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    // Update the employee
    let user = await Employee.findByIdAndUpdate(id, updatedUser, { new: true });
    if (!user) {
      user = await Manager.findByIdAndUpdate(id, updatedUser, { new: true });
    }

    if (!user) {
      console.log("no user found to update");
      return res.status(404).json({ message: "User not found" });
    }

    // Update assigned manager's assigned_employees field
    if (updatedUser.assigned_manager) {
      await Manager.findByIdAndUpdate(updatedUser.assigned_manager, {
        $addToSet: { assigned_employees: id },
      });
    }

    res.status(201).json({ user });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { fetchAllEmp, updateEmployee, fetchUserFromId };
