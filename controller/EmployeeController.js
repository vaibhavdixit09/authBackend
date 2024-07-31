const User = require("../model/User");

const fetchAllEmp = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(type);
    const employees = await User.find({ role: type }); // Fetch employees where role is 'employee'

    res
      .status(200)
      .json({ message: "Data fetched successfully", data: employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Error while getting all employees" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

    if (!user) {
      console.log("no user found to update");
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json({ user });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { fetchAllEmp, updateEmployee };
