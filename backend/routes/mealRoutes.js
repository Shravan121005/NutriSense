const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { logMeal, getMeals, getMealHistory, getMealById, deleteMeal } = require("../controllers/mealController");

router.post("/", authMiddleware, logMeal);
router.get("/", authMiddleware, getMeals);
router.get("/history", authMiddleware, getMealHistory);
router.get("/:id", authMiddleware, getMealById);
router.delete("/:id", authMiddleware, deleteMeal);

module.exports = router;
