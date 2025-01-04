const express = require("express");
const { dashboardScreen } = require("../controllers/screenRoutes");
const router = express.Router();

// Render Login Page
router.get("/", dashboardScreen);

module.exports = router;
