import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

type AuthAction = 'login' | 'signup' | 'logout' | null;

export default function AuthPage() {
  const { login, signup, logout, isSupabaseConfigured, userId, initialized, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState<AuthAction>(null);

  const runAuthAction = async (action: Exclude<AuthAction, null>, handler: () => Promise<{ ok: boolean; message?: string }>) => {
    setLoadingAction(action);
    try {
      const result = await handler();
      if (!result.ok) {
        pushToast(result.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
        return;
      }

      if (result.message) {
        pushToast(result.message);
      }
    } catch {
      pushToast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoadingAction(null);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await runAuthAction('login', () => login(email, password));
  };

  if (initialized && userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-eyebrow">ต้นทุนมัทฉะ</p>
        <h1 className="auth-title">เข้าสู่ระบบเพื่อใช้งานต่อ</h1>
        <p className="auth-subtitle">ใช้แค่อีเมล ก็เริ่มคำนวณต้นทุนได้ทันที</p>

        <form onSubmit={submit} className="space-y-3 mt-5">
          <input className="auth-input text-base" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="auth-input text-base" placeholder="รหัสผ่าน" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isSupabaseConfigured ? <p className="text-sm text-amber-300">ยังไม่พร้อมใช้งาน เพราะยังไม่ได้ตั้งค่า Supabase</p> : null}
          <button disabled={!isSupabaseConfigured || loading || loadingAction === 'login'} className="auth-btn auth-btn-primary">{loadingAction === 'login' ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}</button>
          <button disabled={!isSupabaseConfigured || loading || loadingAction === 'signup'} type="button" onClick={() => runAuthAction('signup', () => signup(email, password))} className="auth-btn auth-btn-secondary">{loadingAction === 'signup' ? 'กำลังสร้างบัญชี…' : 'สร้างบัญชีใหม่'}</button>
          <button disabled={!isSupabaseConfigured || loading || loadingAction === 'logout' || !userId} type="button" onClick={() => runAuthAction('logout', logout)} className="auth-btn auth-btn-ghost">{loadingAction === 'logout' ? 'กำลังออกจากระบบ…' : 'ออกจากระบบ'}</button>
        </form>
      </section>
    </main>
  );
}
