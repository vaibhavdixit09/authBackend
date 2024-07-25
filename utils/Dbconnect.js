const mongoose = require("mongoose");
require("dotenv").config();
const Dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.log("DB not connected", err);
  }
};

module.exports = Dbconnect;
