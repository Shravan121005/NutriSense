const mongoose = require("mongoose");

const nutritionSummarySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: String, // "YYYY-MM-DD" format for easy daily grouping
            required: true,
        },
        totalCalories: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: null,
        },
        mealsCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

nutritionSummarySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("NutritionSummary", nutritionSummarySchema);
