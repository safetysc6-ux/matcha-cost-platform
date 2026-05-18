import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

type AuthAction = 'login' | 'signup' | 'forgot-password' | 'logout' | null;

export default function AuthPage() {
  const { login, signup, logout, forgotPassword, loginWithGoogle, loginWithLine, isSupabaseConfigured, userId, initialized } = useAuth();
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

  return <main className="max-w-md mx-auto p-4 space-y-3"><h1 className="text-xl font-bold">Welcome</h1>
    <form onSubmit={submit} className="glass p-4 rounded-2xl space-y-2">
      <input className="w-full bg-zinc-900 p-2 rounded" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full bg-zinc-900 p-2 rounded" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {!isSupabaseConfigured ? <p className="text-sm text-amber-300">Authentication is disabled because Supabase environment variables are missing.</p> : null}
      <button disabled={!isSupabaseConfigured || loadingAction === 'login'} className="w-full bg-matcha-600 rounded p-2 disabled:opacity-50">{loadingAction === 'login' ? 'Logging in…' : 'Login'}</button>
      <button disabled={!isSupabaseConfigured || loadingAction === 'signup'} type="button" onClick={() => runAuthAction('signup', () => signup(email, password))} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">{loadingAction === 'signup' ? 'Signing up…' : 'Signup'}</button>
      <button disabled={!isSupabaseConfigured || loadingAction === 'forgot-password'} type="button" onClick={() => runAuthAction('forgot-password', () => forgotPassword(email))} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">{loadingAction === 'forgot-password' ? 'Sending…' : 'Forgot Password'}</button>
      <button disabled={!isSupabaseConfigured || loadingAction === 'logout' || !userId} type="button" onClick={() => runAuthAction('logout', logout)} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">{loadingAction === 'logout' ? 'Logging out…' : 'Logout'}</button>
      <button disabled={!isSupabaseConfigured} type="button" onClick={() => loginWithGoogle()} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">Google</button>
      <button disabled={!isSupabaseConfigured} type="button" onClick={() => loginWithLine()} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">LINE</button>
    </form></main>;
}
