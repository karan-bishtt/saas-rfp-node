const express = require("express");
const router = express.Router();

// Importing vendor admin controller functions
const { getVendors, getVendorsInExcel } = require("../controllers/vendors");

// Importing RFP controller functions
const { getRfp, getRfpQuotes } = require("../controllers/rfps");

// Importing category controller functions
const {
  categoriesMethod,
  uploadCategoriesFromExcel,
} = require("../controllers/category");

// Get list of vendors
router.get("/vendor-list", getVendors);

// Get list of vendors
router.get("/vendor-excel", getVendorsInExcel);

// View RFP
router.get("/view-rfp", getRfp);

// View quotes for an RFP
router.get("/get-quotes", getRfpQuotes);

// Get all categories
router.get("/categories", categoriesMethod);
// Change category name
router.put("/change-category-name", categoriesMethod);
// Add a new category
router.post("/add-category", categoriesMethod);
// Delete a category
router.delete("/delete-category", categoriesMethod);

// Add a new category
router.post("/upload-category", uploadCategoriesFromExcel);

module.exports = router;
