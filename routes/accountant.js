const express = require("express");
const router = express.Router();

// Importing vendor admin controller functions
const {
  getVendors,
  vendorStatusChange,
  getVendorsInExcel,
} = require("../controllers/vendors");

// Importing RFP controller functions
const { getRfp, getRfpQuotes } = require("../controllers/rfps");

// Importing category controller functions
const { categoriesMethod } = require("../controllers/category");

// Get all categories
router.get("/categories", categoriesMethod);

// Vendors route
router.get("/vendor-list", getVendors);
router.get("/vendor-excel", getVendorsInExcel);
router.post("/approve-vendor", vendorStatusChange);

// View RFP
router.get("/view-rfp", getRfp);
router.get("/get-quotes", getRfpQuotes);

module.exports = router;
