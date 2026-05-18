import { LineChart, Line, ResponsiveContainer } from 'recharts';
const data = [{ x: 'W1', y: 20 }, { x: 'W2', y: 35 }, { x: 'W3', y: 45 }];
export default function DashboardPage() {
  return <section className="space-y-3"><h1 className="text-xl font-bold">Analytics</h1><div className="glass rounded-2xl p-4 h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="y" stroke="#5E7C4E" /></LineChart></ResponsiveContainer></div></section>;
}
