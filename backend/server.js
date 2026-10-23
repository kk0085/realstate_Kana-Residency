require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const projectRoutes = require("./routes/projectRoutes");
const leadRoutes = require("./routes/leadRoutes");
const visitRoutes = require("./routes/visitRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");

const {
    errorHandler,
} = require("./middleware/errorHandler");

const app = express();

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return true;
    }

    const configuredOrigins = (process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return configuredOrigins.includes(origin);
};

app.use(
    cors({
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Real Estate API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});