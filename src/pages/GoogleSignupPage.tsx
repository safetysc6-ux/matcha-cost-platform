import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

export default function GoogleSignupPage() {
  const { signupWithGoogle, isSupabaseConfigured, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const startGoogle = async () => {
    setSubmitting(true);
    const result = await signupWithGoogle();
    if (!result.ok) {
      pushToast(result.message ?? 'เริ่ม Google Signup ไม่สำเร็จ');
      setSubmitting(false);
    }
  };

  return <main className="auth-screen"><section className="auth-panel text-center">
    <p className="auth-brand">MATCHA COST</p>
    <h1 className="auth-heading">สมัครด้วย Google</h1>
    <p className="auth-copy">เข้าใช้งานได้ทันที ไม่ต้องจำรหัสผ่านใหม่</p>
    <ul className="auth-benefits">
      <li>• เริ่มใช้งานได้เร็ว</li>
      <li>• ปลอดภัยด้วยระบบ Google</li>
      <li>• ซิงก์บัญชีง่ายสำหรับเจ้าของร้าน</li>
    </ul>
    <button onClick={startGoogle} disabled={!isSupabaseConfigured || loading || submitting} className="auth-btn auth-btn-primary mt-4">{submitting ? 'กำลังเชื่อมต่อ Google...' : 'ดำเนินการต่อด้วย Google'}</button>
    <Link to="/signup" className="auth-link">กลับไปหน้าสมัครสมาชิก</Link>
  </section></main>;
}
