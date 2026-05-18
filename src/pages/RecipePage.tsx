const sampleRecipes = [
  { id: 'iced-matcha', title: 'Iced Matcha Latte', prep: '5 min', difficulty: 'Easy', cost: '$2.30 / cup' },
  { id: 'ceremonial-bowl', title: 'Ceremonial Matcha Bowl', prep: '7 min', difficulty: 'Medium', cost: '$1.90 / bowl' }
];

export default function RecipePage() {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Recipes</p>
        <h1 className="text-2xl font-semibold">Your recipe library</h1>
      </header>

      <div className="grid gap-3">
        {sampleRecipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold">{recipe.title}</h2>
              <span className="text-xs text-matcha-300">{recipe.cost}</span>
            </div>
            <p className="text-sm text-zinc-300 mt-2">{recipe.prep} · {recipe.difficulty}</p>
          </article>
        ))}
      </div>

      <div className="empty-state">
        <h3 className="font-semibold">No custom recipes yet</h3>
        <p className="text-sm text-zinc-300 mt-1">Start by adding your first recipe and track cost per serving.</p>
      </div>

      <button className="fab-btn" type="button" aria-label="Add recipe">+</button>
    </section>
  );
}
