import { useMemo, useState } from 'react';
import { calculateRecipeCost } from '@/features/calculator/calc';

export default function HomePage() {
  const [labor, setLabor] = useState(10);
  const result = useMemo(() => calculateRecipeCost({ ingredients: [{ name: 'Matcha', cost: 25 }, { name: 'Milk', cost: 15 }], labor, electricity: 5, packaging: 6, deliveryFee: 8, taxPct: 7, targetMarginPct: 30 }), [labor]);
  const thb = (value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(value);

  return <section className="space-y-5 pb-20">
    <p className="text-xs tracking-[0.2em] uppercase text-[#5f6d55]">Matcha Cost Studio</p>
    <h1 className="text-2xl font-semibold leading-snug text-[#2f382a]">คำนวณต้นทุนมัทฉะพร้อมขาย</h1>
    <p className="text-sm text-stone-600">กรอกต้นทุนแบบง่าย ๆ เพื่อดูราคาขายที่ควรมีกำไร เหมาะกับร้านคาเฟ่และคนขายออนไลน์</p>
    <div className="glass rounded-3xl p-5 space-y-5">
      <label className="text-base block text-stone-700">ค่าแรงต่อแก้ว (บาท)
        <input type="number" value={labor} onChange={(e) => setLabor(Number(e.target.value))} className="w-full mt-2 bg-[#fffaf2] border border-[#d7ccb8] rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#708666]/40 outline-none transition" />
      </label>
      <div className="rounded-2xl bg-[#f2ecdf] border border-[#d9ccb5] p-4 space-y-2 shadow-inner">
        <p className="text-base">ต้นทุนรวมต่อแก้ว: <strong className="text-[#35563d]">{thb(result.totalCost)}</strong></p>
        <p className="text-base">ราคาขายแนะนำ: <strong className="text-[#2c4a33]">{thb(result.recommendedPrice)}</strong></p>
      </div>
      <button className="w-full py-4 rounded-2xl bg-[#35563d] hover:bg-[#2e4d35] text-[#f8f4ec] text-base font-medium transition-all duration-300">บันทึกสูตรนี้</button>
      <p className="text-xs text-stone-500 text-center">丁寧に計算して กำหนดราคาขายอย่างมั่นใจ</p>
    </div>
  </section>;
}
