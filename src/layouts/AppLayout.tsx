import { Home, Book, ChartNoAxesCombined } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/recipes', icon: Book, label: 'Recipes' },
  { to: '/dashboard', icon: ChartNoAxesCombined, label: 'Dashboard' }
];

export const AppLayout = () => {
  const location = useLocation();
  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 safe-p">
      <main className="px-4 py-4"><Outlet /></main>
      <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md p-3">
        <div className="glass rounded-2xl flex justify-around py-2">
          {tabs.map((tab) => {
            const ActiveIcon = tab.icon;
            const active = location.pathname === tab.to;
            return (
              <Link key={tab.to} to={tab.to} className={active ? 'text-matcha-500' : 'text-zinc-300'}>
                <ActiveIcon className="w-5 h-5 mx-auto" /><span className="text-xs">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
