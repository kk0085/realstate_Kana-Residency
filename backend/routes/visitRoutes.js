const express = require("express");

const {
    getVisits,
    getVisit,
    createVisit,
    updateVisit,
    deleteVisit,
} = require("../controllers/visitController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getVisits);
router.get("/:id", protect, adminOnly, getVisit);

router.post("/", createVisit);
router.put("/:id", protect, adminOnly, updateVisit);
router.delete("/:id", protect, adminOnly, deleteVisit);

module.exports = router;