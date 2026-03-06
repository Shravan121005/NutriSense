const Meal = require("../models/Meal");
const NutritionSummary = require("../models/NutritionSummary");

// GET /api/analytics/daily?start=YYYY-MM-DD&end=YYYY-MM-DD
const getDailyCalories = async (req, res) => {
    const { uid } = req.user;
    const { start, end } = req.query;

    try {
        const filter = { userId: uid };
        if (start || end) {
            filter.date = {};
            if (start) filter.date.$gte = start;
            if (end) filter.date.$lte = end;
        }

        const summaries = await NutritionSummary.find(filter).sort({ date: 1 });
        return res.json({ data: summaries });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/analytics/weekly - last 7 days grouped
const getWeeklyTrend = async (req, res) => {
    const { uid } = req.user;

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const startStr = sevenDaysAgo.toISOString().split("T")[0];
    const endStr = today.toISOString().split("T")[0];

    try {
        const summaries = await NutritionSummary.find({
            userId: uid,
            date: { $gte: startStr, $lte: endStr },
        }).sort({ date: 1 });

        return res.json({ data: summaries });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/analytics/top-foods - most frequently logged meal names
const getTopFoods = async (req, res) => {
    const { uid } = req.user;

    try {
        const topFoods = await Meal.aggregate([
            { $match: { userId: uid } },
            { $group: { _id: "$mealName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            { $project: { name: "$_id", count: 1, _id: 0 } },
        ]);
        return res.json({ data: topFoods });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/analytics/avg-rating - average health rating per day (last 30 days)
const getAvgRating = async (req, res) => {
    const { uid } = req.user;

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const startStr = thirtyDaysAgo.toISOString().split("T")[0];
    const endStr = today.toISOString().split("T")[0];

    try {
        const summaries = await NutritionSummary.find({
            userId: uid,
            date: { $gte: startStr, $lte: endStr },
            averageRating: { $ne: null },
        }).sort({ date: 1 });

        return res.json({ data: summaries });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/analytics/today-summary
const getTodaySummary = async (req, res) => {
    const { uid } = req.user;
    const todayStr = new Date().toISOString().split("T")[0];

    try {
        const summary = await NutritionSummary.findOne({ userId: uid, date: todayStr });
        return res.json({ data: summary || { totalCalories: 0, averageRating: null, mealsCount: 0 } });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/analytics/trends - comprehensive trends for last 30 days
const getTrends = async (req, res) => {
    const { uid } = req.user;

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const startStr = thirtyDaysAgo.toISOString().split("T")[0];
    const endStr = today.toISOString().split("T")[0];

    try {
        // Daily summaries for the period
        const dailySummaries = await NutritionSummary.find({
            userId: uid,
            date: { $gte: startStr, $lte: endStr },
        }).sort({ date: 1 });

        // Weekly averages (aggregate meals by ISO week + year)
        const weeklyAverages = await Meal.aggregate([
            {
                $match: {
                    userId: uid,
                    dateTime: {
                        $gte: thirtyDaysAgo,
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: { week: { $isoWeek: "$dateTime" }, year: { $isoWeekYear: "$dateTime" } },
                    avgCalories: { $avg: "$calories" },
                    totalCalories: { $sum: "$calories" },
                    avgRating: { $avg: "$healthRating" },
                    mealCount: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
        ]);

        // Overall stats via aggregation (avoid loading all meals into memory)
        const overallAgg = await Meal.aggregate([
            { $match: { userId: uid } },
            {
                $group: {
                    _id: null,
                    totalMeals: { $sum: 1 },
                    sumCalories: { $sum: "$calories" },
                    sumRating: { $sum: { $ifNull: ["$healthRating", 0] } },
                    ratedCount: {
                        $sum: { $cond: [{ $ne: ["$healthRating", null] }, 1, 0] },
                    },
                },
            },
        ]);

        const stats = overallAgg[0] || { totalMeals: 0, sumCalories: 0, sumRating: 0, ratedCount: 0 };
        const totalMeals = stats.totalMeals;
        const overallAvgCalories = totalMeals > 0 ? Math.round(stats.sumCalories / totalMeals) : 0;
        const overallAvgRating = stats.ratedCount > 0
            ? parseFloat((stats.sumRating / stats.ratedCount).toFixed(2))
            : null;

        return res.json({
            data: {
                dailySummaries,
                weeklyAverages,
                overallStats: {
                    totalMeals,
                    overallAvgCalories,
                    overallAvgRating,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getDailyCalories, getWeeklyTrend, getTopFoods, getAvgRating, getTodaySummary, getTrends };
