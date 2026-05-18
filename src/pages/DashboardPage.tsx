import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

const data = [{ x: 'W1', y: 20 }, { x: 'W2', y: 35 }, { x: 'W3', y: 45 }];

export default function DashboardPage() {
  const safeData = Array.isArray(data) ? data : [];
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    const result = await logout();
    if (!result.ok) pushToast(result.message ?? 'ออกจากระบบไม่สำเร็จ');
    setLoggingOut(false);
  };

  return <section className="space-y-4 pb-20">
    <header className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-[#5f6d55]">Cafe insight</p>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#2f382a]">ภาพรวมยอดขาย</h1>
        <button className="recipe-action-btn" onClick={onLogout} disabled={loggingOut}>{loggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}</button>
      </div>
    </header>

    <div className="glass rounded-3xl p-5 h-64">
      {safeData.length === 0 ? <p className="text-base text-stone-600">ยังไม่มีข้อมูลยอดขายในตอนนี้</p> : <ResponsiveContainer width="100%" height="100%"><LineChart data={safeData} margin={{ left: 8, right: 8, top: 12, bottom: 4 }}><CartesianGrid stroke="#ddd3c3" vertical={false} /><Line type="monotone" dataKey="y" stroke="#35563d" strokeWidth={3} dot={{ r: 3, fill: '#35563d' }} activeDot={{ r: 5 }} isAnimationActive animationDuration={800} /></LineChart></ResponsiveContainer>}
    </div>
  </section>;
}
