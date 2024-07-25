const express = require("express");
const Dbconnect = require("./utils/Dbconnect");
const routes = require("./routes/user.routes");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
Dbconnect();

app.use("/api/v1/", routes);
app.listen(4000, (req, res) => {
  console.log("APP running ");
});
