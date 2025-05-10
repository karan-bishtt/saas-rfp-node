const express = require("express");
const {
  dashboardScreen,
  rfpRequestScreen,
  applyRfpScreen,
} = require("../controllers/screenRoutes");
const router = express.Router();

// Render Login Page
router.get("/", dashboardScreen);

router.get("/rfp-request", rfpRequestScreen);
router.get("/apply-rfp/:rfp_id", applyRfpScreen("apply"));
router.get("/view-rfp/:rfp_id", applyRfpScreen("view"));

module.exports = router;
