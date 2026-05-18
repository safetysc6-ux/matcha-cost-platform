import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { userId, setUserId } = useAuthStore();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, [setUserId]);

  return {
    userId,
    login: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    signup: (email: string, password: string) => supabase.auth.signUp({ email, password }),
    logout: () => supabase.auth.signOut(),
    forgotPassword: (email: string) => supabase.auth.resetPasswordForEmail(email),
    loginWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
    loginWithLine: () => supabase.auth.signInWithOAuth({ provider: 'line' })
  };
};
