const express = require("express");
const router = express.Router();

// Importing category controller functions
const {
  categoriesMethod,
  uploadCategoriesFromExcel,
} = require("../controllers/category");

// Importing vendor admin controller functions
const {
  getVendors,
  approveVendor,
  getVendorsInExcel,
} = require("../controllers/vendors");

// Importing RFP controller functions
const {
  getRfp,
  getRfpQuotes,
  closeRfp,
  createRfp,
} = require("../controllers/rfps");

// Importing manager and accountant controller functions
const { approveManager, getManagers } = require("../controllers/manager");
const {
  approveAccountant,
  getAccountant,
} = require("../controllers/accountant");
const { formDataMiddleware } = require("../middleware/multer");

// Routes

// Categories route
router.get("/categories", categoriesMethod);
router.post("/add-category", categoriesMethod);
router.post("/upload-category", uploadCategoriesFromExcel);
router.put("/change-category-name", formDataMiddleware, categoriesMethod);
router.delete("/delete-category", categoriesMethod);

// Vendors route
router.get("/vendor-list", getVendors);
router.get("/vendor-excel", getVendorsInExcel);
router.post("/approve-vendor", approveVendor);

// RFP routes
router.post("/create-rfp", createRfp);
router.get("/view-rfp", getRfp);
router.put("/close-rfp", closeRfp);
router.get("/get-quotes", getRfpQuotes);

// Manager routes
router.get("/manager-list", getManagers);
router.post("/approve-manager", approveManager);

// Accountant routes
router.get("/accountant-list", getAccountant);
router.post("/approve-accountant", approveAccountant);

module.exports = router;
