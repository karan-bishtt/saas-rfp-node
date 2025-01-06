const express = require("express");
const {
  dashboardScreen,
  getAdminsScreen,
} = require("../controllers/screenRoutes");
const router = express.Router();

// Render Login Page
router.get("/", dashboardScreen);
router.get("/get-admins", getAdminsScreen);
module.exports = router;
