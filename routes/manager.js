const express = require("express");
const router = express.Router();

// Importing vendor admin controller functions
const { getVendors, getVendorsInExcel } = require("../controllers/vendors");

// Importing RFP controller functions
const {
  getRfp,
  getRfpQuotes,
  createRfp,
  closeRfp,
} = require("../controllers/rfps");

// Importing category controller functions
const {
  categoriesMethod,
  uploadCategoriesFromExcel,
} = require("../controllers/category");
const { formDataMiddleware } = require("../middleware/multer");

// Vendors route
router.get("/vendor-list", getVendors);
router.get("/vendor-excel", getVendorsInExcel);

// RFP routes
router.post("/create-rfp", createRfp);
router.get("/view-rfp", getRfp);
router.put("/close-rfp", closeRfp);
router.get("/get-quotes", getRfpQuotes);

// Categories route
router.get("/categories", categoriesMethod);
router.post("/add-category", categoriesMethod);
router.post("/upload-category", formDataMiddleware, uploadCategoriesFromExcel);
router.put("/change-category-name", categoriesMethod);
router.delete("/delete-category", categoriesMethod);

module.exports = router;
