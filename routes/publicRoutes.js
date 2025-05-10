const express = require("express");
const {
  registerManagerScreen,
  registerAdminScreen,
  loginScreen,
  registerAccountantScreen,
  forgotPasswordScreen,
  registerVendorScreen,
} = require("../controllers/screenRoutes");
const router = express.Router();

// Render Login Page
router.get("/", loginScreen);

// Render Register Company Page
router.get("/register-admin", registerAdminScreen);

// Render Register Accountant Page
router.get("/register-accountant", registerAccountantScreen);

// Render Register Procurement Manager Page
router.get("/register-manager", registerManagerScreen);

// Render Register Vendor Page
router.get("/register-vendor", registerVendorScreen);

// Render Forgot Password Page
router.get("/forgot-password", forgotPasswordScreen);

module.exports = router;
