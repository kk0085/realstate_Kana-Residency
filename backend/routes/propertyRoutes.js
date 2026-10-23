const express = require("express");

const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
} = require("../controllers/propertyController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);

router.post("/", protect, adminOnly, createProperty);
router.put("/:id", protect, adminOnly, updateProperty);
router.delete("/:id", protect, adminOnly, deleteProperty);

module.exports = router;