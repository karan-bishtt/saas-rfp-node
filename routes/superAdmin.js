const express = require("express");
const router = express.Router();

const { adminStatusChange, getAdmins } = require("../controllers/admin");

router.get("/admins", getAdmins);
router.post("/approve-admin", adminStatusChange);

module.exports = router;