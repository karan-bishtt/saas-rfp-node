const express = require("express");
const router = express.Router();

const { approveAdmin, getAdmins } = require("../controllers/admin");

router.get("/admins", getAdmins);
router.post("/approve-admin", approveAdmin);

module.exports = router;