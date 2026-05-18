import { LineChart, Line, ResponsiveContainer } from 'recharts';
const data = [{ x: 'W1', y: 20 }, { x: 'W2', y: 35 }, { x: 'W3', y: 45 }];
export default function DashboardPage() {
  const safeData = Array.isArray(data) ? data : [];

  return <section className="space-y-3"><h1 className="text-2xl font-bold">ภาพรวมยอดขาย</h1><div className="glass rounded-2xl p-4 h-56">{safeData.length === 0 ? <p className="text-base text-zinc-400">ยังไม่มีข้อมูลยอดขายในตอนนี้</p> : <ResponsiveContainer width="100%" height="100%"><LineChart data={safeData}><Line type="monotone" dataKey="y" stroke="#5E7C4E" isAnimationActive={false} /></LineChart></ResponsiveContainer>}</div></section>;
}
