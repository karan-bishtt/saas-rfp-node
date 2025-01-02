const express = require("express");
const router = express.Router();

// Importing vendor admin controller functions
const {
  getVendors,
  approveVendor,
  getVendorsInExcel,
} = require("../controllers/vendors");

// Importing RFP controller functions
const { getRfp, getRfpQuotes } = require("../controllers/rfps");

// Importing category controller functions
const { categoriesMethod } = require("../controllers/category");

// Get all categories
router.get("/categories", categoriesMethod);

// Get list of vendors
router.get("/vendor-list", getVendors);

// Get list of vendors
router.get("/vendor-excel", getVendorsInExcel);

// Approve a vendor
router.post("/approve-vendor", approveVendor);

// View RFP
router.get("/view-rfp", getRfp);

// View quotes for an RFP
router.get("/get-quotes", getRfpQuotes);

module.exports = router;
