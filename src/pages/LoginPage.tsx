import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const { login, isSupabaseConfigured, userId, initialized, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    if (!result.ok) pushToast(result.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
    setSubmitting(false);
  };

  if (initialized && userId) return <Navigate to="/dashboard" replace />;

  return <main className="auth-screen"><section className="auth-panel">
    <p className="auth-brand">MATCHA COST</p>
    <h1 className="auth-heading">เข้าสู่ระบบร้านของคุณ</h1>
    <p className="auth-copy">จัดการต้นทุนมัทฉะในหน้าจอเดียว</p>

    <form className="mt-6 space-y-3" onSubmit={submit}>
      <input className="auth-input" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="auth-input" placeholder="รหัสผ่าน" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {!isSupabaseConfigured ? <p className="auth-error">ระบบยังไม่พร้อมใช้งาน (Supabase ยังไม่ถูกตั้งค่า)</p> : null}
      <button disabled={!isSupabaseConfigured || loading || submitting} className="auth-btn auth-btn-primary">{submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</button>
    </form>

    <Link to="/signup" className="auth-link">ยังไม่มีบัญชี? สมัครสมาชิก</Link>
  </section></main>;
}
