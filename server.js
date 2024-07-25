const express = require("express");
const Dbconnect = require("./utils/Dbconnect");
const routes = require("./routes/user.routes");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "https://66a21d1b3dea68e8498cf195--tiny-boba-633a47.netlify.app",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
Dbconnect();

app.use("/api/v1/", routes);
app.listen(PORT, (req, res) => {
  console.log("APP running ");
});
