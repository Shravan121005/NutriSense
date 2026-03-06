const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getDailyCalories,
    getWeeklyTrend,
    getTopFoods,
    getAvgRating,
    getTodaySummary,
    getTrends,
} = require("../controllers/analyticsController");

router.get("/daily", authMiddleware, getDailyCalories);
router.get("/weekly", authMiddleware, getWeeklyTrend);
router.get("/top-foods", authMiddleware, getTopFoods);
router.get("/avg-rating", authMiddleware, getAvgRating);
router.get("/today", authMiddleware, getTodaySummary);
router.get("/trends", authMiddleware, getTrends);

module.exports = router;
