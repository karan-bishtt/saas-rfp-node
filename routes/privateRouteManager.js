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
router.get("/accountant-list", accountantScreen);
router.get("/manager-list", managerScreen);
router.get("/vendor-list", vendorScreen);
router.get("/rfp-list", rpfScreen);
router.get("/category-list", categoryScreen);
router.get("/create-category", addCategoryScreen);
router.get("/create-rfp", addRFPScreen);
router.get("/rfp-quotes/:rfp_id", rfpQuotesScreen);

module.exports = router;
