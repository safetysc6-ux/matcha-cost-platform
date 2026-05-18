import { useMemo, useState } from 'react';
import { calculateRecipeCost } from '@/features/calculator/calc';

export default function HomePage() {
  const [labor, setLabor] = useState(10);
  const result = useMemo(() => calculateRecipeCost({ ingredients: [{ name: 'Matcha', cost: 25 }, { name: 'Milk', cost: 15 }], labor, electricity: 5, packaging: 6, deliveryFee: 8, taxPct: 7, targetMarginPct: 30 }), [labor]);
  const thb = (value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(value);

  return <section className="space-y-4">
    <h1 className="text-2xl font-bold leading-snug">คำนวณต้นทุนมัทฉะพร้อมขาย</h1>
    <p className="text-sm text-zinc-300">กรอกต้นทุนแบบง่าย ๆ เพื่อดูราคาขายที่ควรมีกำไร เหมาะกับร้านคาเฟ่และคนขายออนไลน์</p>
    <div className="glass rounded-2xl p-4 space-y-4">
      <label className="text-base block">ค่าแรงต่อแก้ว (บาท)
        <input type="number" value={labor} onChange={(e) => setLabor(Number(e.target.value))} className="w-full mt-2 bg-zinc-900 rounded-xl p-4 text-lg" />
      </label>
      <div className="rounded-xl bg-zinc-950/70 border border-zinc-800 p-4 space-y-2">
        <p className="text-base">ต้นทุนรวมต่อแก้ว: <strong className="text-matcha-300">{thb(result.totalCost)}</strong></p>
        <p className="text-base">ราคาขายแนะนำ: <strong className="text-matcha-200">{thb(result.recommendedPrice)}</strong></p>
      </div>
      <button className="w-full py-4 rounded-xl bg-matcha-600 text-base font-medium">บันทึกสูตรนี้</button>
    </div>
  </section>;
}
