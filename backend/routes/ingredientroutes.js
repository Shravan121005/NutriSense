const express = require("express");
const router = express.Router();

const Ingredient = require("../models/ingredient");

router.post("/get-rating", async (req, res) => {

    const ingredientName = req.body.ingredientName;

    if (!ingredientName) {
        return res.status(400).json({ error: "Ingredient name required" });
    }

    try {

        const ingredient = await Ingredient.findOne({
            name: { $regex: ingredientName, $options: "i" }
        });

        if (ingredient) {
            return res.json({
                name: ingredient.name,
                description: ingredient.description,
                health_rating: ingredient.health_rating,
                warnings: ingredient.warnings
            });
        }

        return res.json({
            name: ingredientName,
            description: "Not found in database.",
            health_rating: null,
            warnings: "No information available."
        });

    } catch (error) {

        return res.status(500).json({
            error: "Database error",
            details: error.message
        });

    }

});

module.exports = router;