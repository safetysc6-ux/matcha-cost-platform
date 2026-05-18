import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

export default function SignupPage() {
  const { signup, isSupabaseConfigured, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await signup(email, password);
    pushToast(result.message ?? (result.ok ? 'สมัครสมาชิกสำเร็จ' : 'สมัครสมาชิกไม่สำเร็จ'));
    setSubmitting(false);
  };

  return <main className="auth-screen"><section className="auth-panel">
    <p className="auth-brand">MATCHA COST</p>
    <h1 className="auth-heading">สมัครสมาชิก</h1>
    <p className="auth-copy">เริ่มใช้งานระบบคำนวณต้นทุนสำหรับร้านมัทฉะ</p>

    <form className="mt-6 space-y-3" onSubmit={submit}>
      <input className="auth-input" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="auth-input" placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={!isSupabaseConfigured || loading || submitting} className="auth-btn auth-btn-primary">{submitting ? 'กำลังสมัคร...' : 'สมัครด้วยอีเมล'}</button>
    </form>

    <Link to="/signup/google" className="auth-btn auth-btn-google mt-3 text-center">สมัครด้วย Google</Link>
    <Link to="/login" className="auth-link">มีบัญชีแล้ว? กลับไปเข้าสู่ระบบ</Link>
  </section></main>;
}
