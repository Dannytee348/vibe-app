import express from "express";
import Recipe from "../models/Recipe.js";

const router = express.Router();

// GET all saved recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: recipes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST a new calculated recipe
router.post("/", async (req, res) => {
  try {
    const {
      recipeName,
      category,
      yieldQuantity,
      yieldUnit,
      ingredients,
      overheadPercentage,
      profitMarginPercentage,
    } = req.body;

    // Calculate total ingredient cost
    const totalIngredientCost = ingredients.reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0,
    );

    // Calculate overhead and total production cost
    const overheadCost = totalIngredientCost * (overheadPercentage / 100);
    const totalCost = totalIngredientCost + overheadCost;

    // Calculate profit and suggested selling price
    const profitAmount = totalCost * (profitMarginPercentage / 100);
    const suggestedSellingPrice = totalCost + profitAmount;
    const pricePerUnit = suggestedSellingPrice / (yieldQuantity || 1);

    const newRecipe = new Recipe({
      recipeName,
      category,
      yieldQuantity,
      yieldUnit,
      ingredients,
      totalIngredientCost,
      overheadPercentage,
      profitMarginPercentage,
      suggestedSellingPrice: Math.round(suggestedSellingPrice * 100) / 100,
      pricePerUnit: Math.round(pricePerUnit * 100) / 100,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json({ success: true, data: savedRecipe });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE a recipe by ID
router.delete("/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
