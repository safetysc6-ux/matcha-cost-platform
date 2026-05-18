import { FormEvent, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';

export default function AuthPage() {
  const { login, signup, forgotPassword, loginWithGoogle, loginWithLine } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: FormEvent) => { e.preventDefault(); await login(email, password); };
  return <main className="max-w-md mx-auto p-4 space-y-3"><h1 className="text-xl font-bold">Welcome</h1>
    <form onSubmit={submit} className="glass p-4 rounded-2xl space-y-2">
      <input className="w-full bg-zinc-900 p-2 rounded" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full bg-zinc-900 p-2 rounded" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full bg-matcha-600 rounded p-2">Login</button>
      <button type="button" onClick={() => signup(email, password)} className="w-full bg-zinc-700 rounded p-2">Signup</button>
      <button type="button" onClick={() => forgotPassword(email)} className="w-full bg-zinc-700 rounded p-2">Forgot Password</button>
      <button type="button" onClick={() => loginWithGoogle()} className="w-full bg-zinc-700 rounded p-2">Google</button>
      <button type="button" onClick={() => loginWithLine()} className="w-full bg-zinc-700 rounded p-2">LINE</button>
    </form></main>;
}
