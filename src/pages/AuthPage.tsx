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
        pushToast(result.message ?? 'Authentication request failed.');
        return;
      }

      if (result.message) {
        pushToast(result.message);
      }
    } catch {
      pushToast('Unexpected authentication error. Please try again.');
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
        <p className="auth-eyebrow">MATCHA COST</p>
        <h1 className="auth-title">Sign in to continue</h1>
        <p className="auth-subtitle">Simple, stable auth with email only.</p>

        <form onSubmit={submit} className="space-y-3 mt-5">
          <input className="auth-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="auth-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isSupabaseConfigured ? <p className="text-sm text-amber-300">Authentication is disabled because Supabase environment variables are missing.</p> : null}
          <button disabled={!isSupabaseConfigured || loading || loadingAction === 'login'} className="auth-btn auth-btn-primary">{loadingAction === 'login' ? 'Logging in…' : 'Login'}</button>
          <button disabled={!isSupabaseConfigured || loading || loadingAction === 'signup'} type="button" onClick={() => runAuthAction('signup', () => signup(email, password))} className="auth-btn auth-btn-secondary">{loadingAction === 'signup' ? 'Creating account…' : 'Create account'}</button>
          <button disabled={!isSupabaseConfigured || loading || loadingAction === 'logout' || !userId} type="button" onClick={() => runAuthAction('logout', logout)} className="auth-btn auth-btn-ghost">{loadingAction === 'logout' ? 'Logging out…' : 'Logout'}</button>
        </form>
      </section>
    </main>
  );
}
