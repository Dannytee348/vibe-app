import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Calculator,
  Save,
  ChefHat,
  DollarSign,
  Package,
} from "lucide-react";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("Pastries & Baking");
  const [yieldQuantity, setYieldQuantity] = useState(12);
  const [yieldUnit, setYieldUnit] = useState("pieces");
  const [overheadPercentage, setOverheadPercentage] = useState(20);
  const [profitMarginPercentage, setProfitMarginPercentage] = useState(40);

  const [ingredients, setIngredients] = useState([
    {
      name: "Flour",
      quantityUsed: 500,
      unit: "g",
      costPerUnit: 2,
      totalCost: 1000,
    },
    {
      name: "Sugar",
      quantityUsed: 200,
      unit: "g",
      costPerUnit: 1.5,
      totalCost: 300,
    },
    {
      name: "Butter",
      quantityUsed: 250,
      unit: "g",
      costPerUnit: 4,
      totalCost: 1000,
    },
  ]);

  const [currName, setCurrName] = useState("");
  const [currQty, setCurrQty] = useState("");
  const [currCost, setCurrCost] = useState("");

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRecipes(data.data);
      })
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!currName || !currQty || !currCost) return;
    const qty = parseFloat(currQty);
    const cost = parseFloat(currCost);
    const totalCost = qty * cost;
    setIngredients([
      ...ingredients,
      {
        name: currName,
        quantityUsed: qty,
        unit: "g",
        costPerUnit: cost,
        totalCost,
      },
    ]);
    setCurrName("");
    setCurrQty("");
    setCurrCost("");
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const totalIngredientCost = ingredients.reduce(
    (sum, item) => sum + (item.totalCost || 0),
    0,
  );
  const overheadCost = totalIngredientCost * (overheadPercentage / 100);
  const totalProductionCost = totalIngredientCost + overheadCost;
  const profitAmount = totalProductionCost * (profitMarginPercentage / 100);
  const suggestedSellingPrice = totalProductionCost + profitAmount;
  const pricePerUnit =
    yieldQuantity > 0 ? suggestedSellingPrice / yieldQuantity : 0;

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    if (!recipeName || ingredients.length === 0) {
      alert("Please enter a recipe name and at least one ingredient.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeName,
          category,
          yieldQuantity: parseFloat(yieldQuantity),
          yieldUnit,
          ingredients,
          overheadPercentage: parseFloat(overheadPercentage),
          profitMarginPercentage: parseFloat(profitMarginPercentage),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecipes([data.data, ...recipes]);
        setRecipeName("");
        alert("Recipe & pricing saved successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRecipes(recipes.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <ChefHat className="text-emerald-400 w-8 h-8" />
              CaterCost & Pricing Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Calculate exact ingredient expenses, overhead, and profitable
              retail prices for your culinary business.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="w-5 h-5 text-emerald-400" /> New Recipe
              Cost Breakdown
            </h2>

            <form onSubmit={handleSaveRecipe} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Recipe Name
                  </label>
                  <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="e.g. Vanilla Birthday Cake"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pastries & Baking">Pastries & Baking</option>
                    <option value="Catering & Meals">Catering & Meals</option>
                    <option value="Drinks & Beverages">
                      Drinks & Beverages
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Yield Qty
                  </label>
                  <input
                    type="number"
                    value={yieldQuantity}
                    onChange={(e) => setYieldQuantity(e.target.value)}
                    min="1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Yield Unit
                  </label>
                  <input
                    type="text"
                    value={yieldUnit}
                    onChange={(e) => setYieldUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Overhead %
                  </label>
                  <input
                    type="number"
                    value={overheadPercentage}
                    onChange={(e) => setOverheadPercentage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  <span>Target Profit Margin</span>
                  <span className="text-emerald-400 font-bold">
                    {profitMarginPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={profitMarginPercentage}
                  onChange={(e) => setProfitMarginPercentage(e.target.value)}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Ingredients
                </h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
                      <tr>
                        <th className="p-3">Ingredient</th>
                        <th className="p-3">Qty Used</th>
                        <th className="p-3">Cost/Unit</th>
                        <th className="p-3">Total</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {ingredients.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3 text-slate-400">
                            {item.quantityUsed} {item.unit}
                          </td>
                          <td className="p-3 text-slate-400">
                            ₦{item.costPerUnit}
                          </td>
                          <td className="p-3 font-semibold text-emerald-400">
                            ₦{item.totalCost.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(idx)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={currName}
                    onChange={(e) => setCurrName(e.target.value)}
                    className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={currQty}
                    onChange={(e) => setCurrQty(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Cost/Unit"
                    value={currCost}
                    onChange={(e) => setCurrCost(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl px-4 py-2 text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Save className="w-5 h-5" />{" "}
                {loading ? "Saving..." : "Save Recipe & Pricing"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6 sticky top-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
                <DollarSign className="w-5 h-5" /> Live Pricing Summary
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Raw Ingredients Cost:</span>
                  <span className="font-bold">
                    ₦{totalIngredientCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">
                    Overhead ({overheadPercentage}%):
                  </span>
                  <span className="font-bold">₦{overheadCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Total Production Cost:</span>
                  <span className="font-bold">
                    ₦{totalProductionCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Target Profit:</span>
                  <span className="font-bold text-emerald-400">
                    ₦{profitAmount.toFixed(2)}
                  </span>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 space-y-2 mt-4 text-center">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Suggested Selling Price
                  </span>
                  <div className="text-3xl font-extrabold text-white">
                    ₦{suggestedSellingPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-emerald-300 pt-1">
                    ₦{pricePerUnit.toFixed(2)} per {yieldUnit}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" /> Saved Recipes
            Catalog
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase">
                      {recipe.category}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {recipe.recipeName}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3 flex items-center justify-between border border-slate-800">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Total Price
                    </div>
                    <div className="text-base font-bold text-emerald-400">
                      ₦{recipe.suggestedSellingPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Per {recipe.yieldUnit}
                    </div>
                    <div className="text-base font-bold text-white">
                      ₦{recipe.pricePerUnit.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
