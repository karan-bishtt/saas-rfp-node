const express = require("express");
const router = express.Router();

// Importing authentication controller functions
const {
  registerAdmin,
  login,
  registerAccount,
  registerManager,
  registerVendor,
  resetPassword,
  confirmotpresetPassword,
  forgetPassword,
  getTenants,
} = require("../controllers/auth");

// Importing category controller functions
const { categoriesMethod } = require("../controllers/category");

// USING ROUTES MIDDLEWARE

// User registration
router.post("/register-admin", registerAdmin);
router.post("/register-manager", registerManager);
router.post("/register-accountant", registerAccount);
router.post("/register-vendor", registerVendor);

// User login
router.post("/login", login);

// Get category (public access)
router.get("/category", categoriesMethod);

// Reset password
router.get("/reset-password", resetPassword);
router.post("/reset-password", confirmotpresetPassword);

// Forget password
router.post("/forgot-password", forgetPassword);

// Get tenants (public access)
router.get("/tenants", getTenants);

module.exports = router;
