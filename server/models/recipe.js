import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    recipeName: { type: String, required: true, trim: true },
    category: { type: String, default: "Pastries & Baking" },
    yieldQuantity: { type: Number, required: true }, // e.g., 12 cupcakes or 1 cake
    yieldUnit: { type: String, default: "pieces" },
    ingredients: [
      {
        name: { type: String, required: true },
        quantityUsed: { type: Number, required: true }, // e.g., 500 (grams)
        unit: { type: String, required: true }, // e.g., g, kg, ml, pcs
        costPerUnit: { type: Number, required: true }, // cost per 1g or 1kg
        totalCost: { type: Number, required: true }, // quantityUsed * costPerUnit
      },
    ],
    totalIngredientCost: { type: Number, required: true },
    overheadPercentage: { type: Number, default: 20 }, // e.g., 20% for gas, electricity, packaging
    profitMarginPercentage: { type: Number, default: 40 }, // e.g., 40% target profit
    suggestedSellingPrice: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Recipe", recipeSchema);
