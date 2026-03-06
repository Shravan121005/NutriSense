const Meal = require("../models/Meal");
const NutritionSummary = require("../models/NutritionSummary");
const Ingredient = require("../models/ingredient");

// Helper: compute average health rating from ingredient names
const computeHealthRating = async (ingredients) => {
    if (!ingredients || ingredients.length === 0) return null;

    let total = 0;
    let count = 0;

    for (const name of ingredients) {
        const ingredient = await Ingredient.findOne({
            name: { $regex: name.trim(), $options: "i" },
        });
        if (ingredient && ingredient.health_rating != null) {
            total += ingredient.health_rating;
            count++;
        }
    }

    return count > 0 ? parseFloat((total / count).toFixed(2)) : null;
};

// Helper: update or create NutritionSummary for the day
const updateDailySummary = async (userId, mealDateTime) => {
    // Use the meal's own date to update the correct day's summary
    const d = mealDateTime ? new Date(mealDateTime) : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    const dayMeals = await Meal.find({
        userId,
        dateTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalCalories = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const ratingsArr = dayMeals
        .filter((m) => m.healthRating != null)
        .map((m) => m.healthRating);
    const averageRating =
        ratingsArr.length > 0
            ? parseFloat(
                (ratingsArr.reduce((a, b) => a + b, 0) / ratingsArr.length).toFixed(2)
              )
            : null;

    await NutritionSummary.findOneAndUpdate(
        { userId, date: dateStr },
        { totalCalories, averageRating, mealsCount: dayMeals.length },
        { upsert: true, new: true }
    );
};

// POST /api/meals
const logMeal = async (req, res) => {
    const { uid } = req.user;
    const { mealName, ingredients, calories, dateTime, notes } = req.body;

    if (!mealName || calories == null) {
        return res
            .status(400)
            .json({ error: "mealName and calories are required" });
    }

    try {
        const healthRating = await computeHealthRating(ingredients);

        const meal = await Meal.create({
            userId: uid,
            mealName,
            ingredients: ingredients || [],
            calories: Number(calories),
            dateTime: dateTime ? new Date(dateTime) : new Date(),
            notes: notes || "",
            healthRating,
        });

        await updateDailySummary(uid, meal.dateTime);

        return res.status(201).json({ meal });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/meals
const getMeals = async (req, res) => {
    const { uid } = req.user;
    const { start, end, limit = 50, page = 1 } = req.query;

    try {
        const filter = { userId: uid };

        if (start || end) {
            filter.dateTime = {};
            if (start) filter.dateTime.$gte = new Date(start);
            if (end) filter.dateTime.$lte = new Date(end);
        }

        const meals = await Meal.find(filter)
            .sort({ dateTime: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Meal.countDocuments(filter);

        return res.json({ meals, total });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/meals/history?page=1&limit=20
const getMealHistory = async (req, res) => {
    const { uid } = req.user;
    const { page = 1, limit = 20, start, end } = req.query;

    try {
        const filter = { userId: uid };
        if (start || end) {
            filter.dateTime = {};
            if (start) filter.dateTime.$gte = new Date(start);
            if (end) filter.dateTime.$lte = new Date(end);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const meals = await Meal.find(filter)
            .sort({ dateTime: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Meal.countDocuments(filter);
        const totalPages = Math.ceil(total / Number(limit));

        return res.json({ meals, total, page: Number(page), totalPages });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/meals/:id
const getMealById = async (req, res) => {
    const { uid } = req.user;

    try {
        const meal = await Meal.findOne({ _id: req.params.id, userId: uid });
        if (!meal) return res.status(404).json({ error: "Meal not found" });
        return res.json({ meal });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// DELETE /api/meals/:id
const deleteMeal = async (req, res) => {
    const { uid } = req.user;

    try {
        const meal = await Meal.findOneAndDelete({ _id: req.params.id, userId: uid });
        if (!meal) return res.status(404).json({ error: "Meal not found" });

        await updateDailySummary(uid, meal.dateTime);
        return res.json({ message: "Meal deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { logMeal, getMeals, getMealHistory, getMealById, deleteMeal };
