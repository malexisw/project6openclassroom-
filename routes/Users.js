// routes/User.js

const express = require("express");
const router = express.Router();
const userCtrl = require('../controller/Users');

router.post("/api/auth/signup", userCtrl.signup);
router.post("/api/auth/login", userCtrl.login);

module.exports = router;
