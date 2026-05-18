import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/useAuth';

type FormValues = {
  recipeName: string;
  matchaCost: number;
  gramsUsed: number;
  milkCost: number;
  cupCost: number;
  toppingCost: number;
  sellingPrice: number;
};

const defaultForm: FormValues = {
  recipeName: '',
  matchaCost: 0,
  gramsUsed: 0,
  milkCost: 0,
  cupCost: 0,
  toppingCost: 0,
  sellingPrice: 0
};

const toNum = (v: string) => Number(v) || 0;

export default function RecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { userId, session } = useAuth();

  const [form, setForm] = useState<FormValues>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const calculated = useMemo(() => {
    const ingredientCost = form.matchaCost * form.gramsUsed + form.milkCost + form.toppingCost;
    const totalCost = ingredientCost + form.cupCost;
    const profit = form.sellingPrice - totalCost;
    const marginPct = form.sellingPrice > 0 ? (profit / form.sellingPrice) * 100 : 0;
    return { ingredientCost, totalCost, profit, marginPct };
  }, [form]);

  useEffect(() => {
    if (!isEdit || !supabase || !id || !userId) return;

    const fetchRecipe = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('id, recipe_name, ingredients, ingredient_cost, packaging_cost, selling_price')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (fetchError || !data) {
        setError(fetchError?.message ?? 'Recipe not found.');
        setLoading(false);
        return;
      }

      const ingredients = (data.ingredients as Array<{ name: string; amount: number }> | null) ?? [];
      const matchaCost = ingredients.find((i) => i.name === 'matcha_cost_per_gram')?.amount ?? 0;
      const gramsUsed = ingredients.find((i) => i.name === 'grams_used')?.amount ?? 0;
      const milkCost = ingredients.find((i) => i.name === 'milk_cost')?.amount ?? 0;
      const toppingCost = ingredients.find((i) => i.name === 'topping_cost')?.amount ?? 0;

      setForm({
        recipeName: data.recipe_name,
        matchaCost,
        gramsUsed,
        milkCost,
        cupCost: Number(data.packaging_cost ?? 0),
        toppingCost,
        sellingPrice: Number(data.selling_price ?? 0)
      });
      setLoading(false);
    };

    void fetchRecipe();
  }, [id, isEdit, userId]);

  const setField = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: field === 'recipeName' ? value : toNum(value) }));
  };
  const thb = (value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(value);

  const saveRecipe = async () => {
    if (!supabase || !userId) {
      setError('ต้องเข้าสู่ระบบและตั้งค่า Supabase ก่อน');
      return;
    }

    if (!form.recipeName.trim()) {
      setError('กรุณาใส่ชื่อสูตร');
      return;
    }

    setSaving(true);
    setError(null);

    await supabase.from('profiles').upsert({ id: userId, username: session?.user?.email ?? null }, { onConflict: 'id' });

    const payload = {
      user_id: userId,
      recipe_name: form.recipeName.trim(),
      ingredients: [
        { name: 'matcha_cost_per_gram', amount: form.matchaCost },
        { name: 'grams_used', amount: form.gramsUsed },
        { name: 'milk_cost', amount: form.milkCost },
        { name: 'topping_cost', amount: form.toppingCost }
      ],
      packaging_cost: form.cupCost,
      ingredient_cost: calculated.ingredientCost,
      total_cost: calculated.totalCost,
      selling_price: form.sellingPrice,
      profit: calculated.profit,
      margin_pct: calculated.marginPct,
      status: 'draft',
      visibility: 'private'
    };

    const query = isEdit
      ? supabase.from('recipes').update(payload).eq('id', id).eq('user_id', userId)
      : supabase.from('recipes').insert(payload);

    const { error: saveError } = await query;

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    navigate('/recipes');
  };

  return (
    <section className="space-y-4 pb-24">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">สูตรขาย</p>
        <h1 className="text-2xl font-semibold">{isEdit ? 'แก้ไขสูตร' : 'เพิ่มสูตรใหม่'}</h1>
      </header>

      {loading ? (
        <p className="text-sm text-zinc-300">กำลังโหลดข้อมูลสูตร...</p>
      ) : (
        <div className="recipe-card space-y-3">
          {error && <p className="text-sm text-rose-300">{error}</p>}

          <label className="space-y-1 block">
            <span className="text-base text-zinc-300">ชื่อเมนู</span>
            <input className="auth-input text-base" value={form.recipeName} onChange={(e) => setField('recipeName', e.target.value)} placeholder="เช่น มัทฉะลาเต้เย็น" />
          </label>

          {[
            ['matchaCost', 'ราคามัทฉะต่อกรัม (บาท)'],
            ['gramsUsed', 'ใช้มัทฉะกี่กรัม'],
            ['milkCost', 'ค่านมต่อแก้ว (บาท)'],
            ['cupCost', 'ค่าแก้ว/บรรจุภัณฑ์ (บาท)'],
            ['toppingCost', 'ค่าท็อปปิ้ง (บาท)'],
            ['sellingPrice', 'ราคาขายต่อแก้ว (บาท)']
          ].map(([field, label]) => (
            <label className="space-y-1 block" key={field}>
              <span className="text-base text-zinc-300">{label}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="auth-input text-base"
                value={form[field as keyof FormValues] as number}
                onChange={(e) => setField(field as keyof FormValues, e.target.value)}
              />
            </label>
          ))}

          <div className="rounded-xl bg-zinc-950/70 border border-zinc-800 p-4 text-base space-y-2">
            <p>ต้นทุนวัตถุดิบ: {thb(calculated.ingredientCost)}</p>
            <p>ต้นทุนรวมต่อแก้ว: {thb(calculated.totalCost)}</p>
            <p>กำไรต่อแก้ว: {thb(calculated.profit)}</p>
            <p>มาร์จินกำไร: {calculated.marginPct.toFixed(2)}%</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button className="auth-btn auth-btn-primary" type="button" onClick={() => void saveRecipe()} disabled={saving}>
              {saving ? 'กำลังบันทึก...' : 'บันทึกสูตร'}
            </button>
            <Link className="auth-btn auth-btn-ghost" to="/recipes">ยกเลิก</Link>
          </div>
        </div>
      )}
    </section>
  );
}
