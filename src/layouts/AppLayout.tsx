import { Home, Book, ChartNoAxesCombined } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/', icon: Home, label: 'หน้าหลัก' },
  { to: '/recipes', icon: Book, label: 'สูตรขาย' },
  { to: '/dashboard', icon: ChartNoAxesCombined, label: 'ภาพรวม' }
];

export const AppLayout = () => {
  const location = useLocation();
  return (
    <div className="app-shell">
      <main className="app-content"><Outlet /></main>
      <nav className="bottom-nav-wrap" aria-label="เมนูหลัก">
        <div className="bottom-nav">
          {tabs.map((tab) => {
            const ActiveIcon = tab.icon;
            const active = location.pathname === tab.to;
            return (
              <Link key={tab.to} to={tab.to} className={active ? 'bottom-nav-item is-active' : 'bottom-nav-item'}>
                <ActiveIcon className="w-5 h-5 mx-auto" /><span className="text-xs">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
