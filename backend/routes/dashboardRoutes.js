const express = require("express");

const {
    getDashboard,
} = require("../controllers/dashboardController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getDashboard);

module.exports = router;