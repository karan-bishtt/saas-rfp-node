const express = require("express");
const {
  dashboardScreen,
  accountantScreen,
  managerScreen,
  vendorScreen,
  rpfScreen,
  categoryScreen,
  addCategoryScreen,
  addRFPScreen,
  rfpQuotesScreen,
} = require("../controllers/screenRoutes");
const router = express.Router();

// Render Login Page
router.get("/", dashboardScreen);
router.get("/vendor-list", vendorScreen);
router.get("/rfp-list", rpfScreen);
router.get("/category-list", categoryScreen);
router.get("/rfp-quotes/:rfp_id", rfpQuotesScreen);
module.exports = router;
