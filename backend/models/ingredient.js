const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: String,

  health_rating: Number,

  warnings: String

});

module.exports = mongoose.model("ingredient", ingredientSchema);