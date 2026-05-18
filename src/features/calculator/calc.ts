export type Ingredient = { name: string; cost: number };
export type CalcInput = { ingredients: Ingredient[]; labor: number; electricity: number; packaging: number; deliveryFee: number; taxPct: number; targetMarginPct: number };

export const calculateRecipeCost = (input: CalcInput) => {
  const ingredientCost = input.ingredients.reduce((s, i) => s + i.cost, 0);
  const subtotal = ingredientCost + input.labor + input.electricity + input.packaging;
  const tax = subtotal * (input.taxPct / 100);
  const totalCost = subtotal + tax + input.deliveryFee;
  const recommendedPrice = totalCost / (1 - input.targetMarginPct / 100);
  const profit = recommendedPrice - totalCost;
  const margin = (profit / recommendedPrice) * 100;
  return { ingredientCost, subtotal, tax, totalCost, recommendedPrice, profit, margin };
};
