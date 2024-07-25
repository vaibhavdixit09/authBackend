const express = require("express");
const { login, signup } = require("../controller/AuthController");
const router = express.Router();

router.post("/login", login);
router.post("/Signup", signup);

module.exports = router;
