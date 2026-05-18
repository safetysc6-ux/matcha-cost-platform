import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/useAuth';

type RecipeRow = {
  id: string;
  recipe_name: string;
  ingredient_cost: number;
  total_cost: number;
  selling_price: number;
  profit: number;
  margin_pct: number;
};

const fmtCurrency = (value: number) => `$${value.toFixed(2)}`;

export default function RecipePage() {
  const { userId, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasRecipes = useMemo(() => recipes.length > 0, [recipes]);

  const fetchRecipes = async () => {
    if (!supabase || !userId) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('recipes')
      .select('id, recipe_name, ingredient_cost, total_cost, selling_price, profit, margin_pct')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setRecipes([]);
    } else {
      setRecipes((data as RecipeRow[]) ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    void fetchRecipes();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!supabase || !userId) return;
    const confirmed = window.confirm('Delete this recipe?');
    if (!confirmed) return;

    setDeletingId(id);
    const { error: deleteError } = await supabase.from('recipes').delete().eq('id', id).eq('user_id', userId);
    setDeletingId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  return (
    <section className="space-y-4 pb-20">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Recipes</p>
        <h1 className="text-2xl font-semibold">Your recipe library</h1>
      </header>

      {!isSupabaseConfigured && (
        <div className="empty-state">
          <h3 className="font-semibold">Supabase not configured</h3>
          <p className="text-sm text-zinc-300 mt-1">Add env keys to save and manage recipes.</p>
        </div>
      )}

      {error && <p className="text-sm text-rose-300">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-300">Loading recipes...</p>
      ) : (
        <div className="grid gap-3">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="recipe-card">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold">{recipe.recipe_name}</h2>
                <span className="text-xs text-matcha-300">{fmtCurrency(recipe.total_cost)} / cup</span>
              </div>

              <div className="mt-3 text-sm text-zinc-300 space-y-1">
                <p>Ingredient Cost: {fmtCurrency(recipe.ingredient_cost)}</p>
                <p>Selling Price: {fmtCurrency(recipe.selling_price)}</p>
                <p>Profit: {fmtCurrency(recipe.profit)} · Margin: {recipe.margin_pct.toFixed(1)}%</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link className="recipe-action-btn" to={`/recipes/${recipe.id}/edit`} aria-label={`Edit ${recipe.recipe_name}`}>
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <button
                  className="recipe-action-btn recipe-action-btn-danger"
                  type="button"
                  onClick={() => void handleDelete(recipe.id)}
                  disabled={deletingId === recipe.id}
                >
                  <Trash2 className="w-4 h-4" /> {deletingId === recipe.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !hasRecipes && (
        <div className="empty-state">
          <h3 className="font-semibold">No recipes yet</h3>
          <p className="text-sm text-zinc-300 mt-1">Tap + to add your first recipe.</p>
        </div>
      )}

      <button className="fab-btn" type="button" aria-label="Add recipe" onClick={() => navigate('/recipes/new')}>
        +
      </button>
    </section>
  );
}
