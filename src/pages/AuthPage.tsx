import { FormEvent, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { pushToast } from '@/components/ui/Toast';

export default function AuthPage() {
  const { login, signup, logout, forgotPassword, loginWithGoogle, loginWithLine, isSupabaseConfigured, userId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const runAuthAction = async (action: string, handler: () => Promise<{ ok: boolean; message?: string }>) => {
    setLoadingAction(action);
    const result = await handler();
    if (!result.ok) {
      pushToast(result.message ?? 'Authentication request failed.');
    } else if (result.message) {
      pushToast(result.message);
    }
    setLoadingAction(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await runAuthAction('login', () => login(email, password));
  };

  return <main className="max-w-md mx-auto p-4 space-y-3"><h1 className="text-xl font-bold">Welcome</h1>
    <form onSubmit={submit} className="glass p-4 rounded-2xl space-y-2">
      <input className="w-full bg-zinc-900 p-2 rounded" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full bg-zinc-900 p-2 rounded" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {!isSupabaseConfigured ? <p className="text-sm text-amber-300">Authentication is disabled because Supabase environment variables are missing.</p> : null}
      <button disabled={!isSupabaseConfigured || loadingAction !== null} className="w-full bg-matcha-600 rounded p-2 disabled:opacity-50">Login</button>
      <button disabled={!isSupabaseConfigured || loadingAction !== null} type="button" onClick={() => runAuthAction('signup', () => signup(email, password))} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">Signup</button>
      <button disabled={!isSupabaseConfigured || loadingAction !== null} type="button" onClick={() => runAuthAction('forgot-password', () => forgotPassword(email))} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">Forgot Password</button>
      <button disabled={!isSupabaseConfigured || loadingAction !== null || !userId} type="button" onClick={() => runAuthAction('logout', logout)} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">Logout</button>
      <button disabled={!isSupabaseConfigured} type="button" onClick={() => loginWithGoogle()} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">Google</button>
      <button disabled={!isSupabaseConfigured} type="button" onClick={() => loginWithLine()} className="w-full bg-zinc-700 rounded p-2 disabled:opacity-50">LINE</button>
    </form></main>;
}
