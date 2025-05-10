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
  vendorStatusChange,
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
const { managerStatusChange, getManagers } = require("../controllers/manager");
const {
  accountantStatusChange,
  getAccountant,
} = require("../controllers/accountant");
const { formDataMiddleware } = require("../middleware/multer");

// Routes

// Categories route
router.get("/categories", categoriesMethod);
router.post("/add-category", categoriesMethod);
router.post("/upload-category", formDataMiddleware, uploadCategoriesFromExcel);
router.put("/change-category-name", categoriesMethod);
router.delete("/delete-category", categoriesMethod);

// Vendors route
router.get("/vendor-list", getVendors);
router.get("/vendor-excel", getVendorsInExcel);
router.post("/approve-vendor", vendorStatusChange);

// RFP routes
router.post("/create-rfp", createRfp);
router.get("/view-rfp", getRfp);
router.put("/close-rfp", closeRfp);
router.get("/get-quotes", getRfpQuotes);

// Manager routes
router.get("/manager-list", getManagers);
router.post("/approve-manager", managerStatusChange);

// Accountant routes
router.get("/accountant-list", getAccountant);
router.post("/approve-accountant", accountantStatusChange);

module.exports = router;
