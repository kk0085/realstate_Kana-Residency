const express = require("express");

const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
} = require("../controllers/leadController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getLeads);
router.get("/:id", protect, adminOnly, getLead);

router.post("/", createLead);

router.put("/:id", protect, adminOnly, updateLead);
router.delete("/:id", protect, adminOnly, deleteLead);

module.exports = router;