const express = require("express");
const router = express.Router();

// Importing RFP controller functions
const { getRfpVendor, applyRfp } = require("../controllers/rfpVendors");

router.get("/get-rfp", getRfpVendor);

// Apply for an RFP (vendor access required)
router.post("/apply-rfp", applyRfp);

module.exports = router;
