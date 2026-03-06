const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
    {
        userId: {
            type: String, // Firebase UID
            required: true,
            index: true,
        },
        mealName: {
            type: String,
            required: true,
            trim: true,
        },
        ingredients: {
            type: [String],
            default: [],
        },
        calories: {
            type: Number,
            required: true,
            min: 0,
        },
        dateTime: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            default: "",
        },
        healthRating: {
            type: Number,
            default: null,
            min: 0,
            max: 5,
        },
    },
    { timestamps: true }
);

// Index for efficient date-range queries
mealSchema.index({ userId: 1, dateTime: -1 });

module.exports = mongoose.model("Meal", mealSchema);
