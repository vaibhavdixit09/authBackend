const express = require("express");
const Dbconnect = require("./utils/Dbconnect");
const routes = require("./routes/user.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: ["https://tiny-boba-633a47.netlify.app", "http://localhost:5173"],
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
Dbconnect();

app.use("/api/v1/", routes);
app.listen(PORT, (req, res) => {
  console.log("APP running ", PORT);
});
