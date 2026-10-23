const express = require("express");

const {
    getSiteSettings,
    updateSiteSettings,
} = require("../controllers/siteSettingsController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSiteSettings);
router.put("/", protect, adminOnly, updateSiteSettings);

module.exports = router;
