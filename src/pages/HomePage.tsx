import { useMemo, useState } from 'react';
import { calculateRecipeCost } from '@/features/calculator/calc';

export default function HomePage() {
  const [labor, setLabor] = useState(10);
  const result = useMemo(() => calculateRecipeCost({ ingredients: [{ name: 'Matcha', cost: 25 }, { name: 'Milk', cost: 15 }], labor, electricity: 5, packaging: 6, deliveryFee: 8, taxPct: 7, targetMarginPct: 30 }), [labor]);

  return <section className="space-y-4">
    <h1 className="text-xl font-bold">Matcha Cost Calculator</h1>
    <div className="glass rounded-2xl p-4 space-y-3">
      <label className="text-sm">Labor Cost
        <input type="number" value={labor} onChange={(e) => setLabor(Number(e.target.value))} className="w-full mt-1 bg-zinc-900 rounded-lg p-2" />
      </label>
      <p>Total Cost: ฿{result.totalCost.toFixed(2)}</p>
      <p>Recommended Price: ฿{result.recommendedPrice.toFixed(2)}</p>
      <button className="w-full py-3 rounded-xl bg-matcha-600">Save Recipe</button>
    </div>
  </section>;
}
