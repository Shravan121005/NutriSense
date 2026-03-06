require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
// Import firebase config to initialize Admin SDK on startup
require("./config/firebase");

const ingredientRoutes = require("./routes/ingredientroutes");
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

/* ORIGINAL API ROUTE - preserved */
app.use("/api", ingredientRoutes);

/* NEW API ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);

/* Error handler */
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`NutriSense server running on port ${PORT}`);
});