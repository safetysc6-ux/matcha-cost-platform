import { useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { userId, setUserId, initialized, setInitialized } = useAuthStore();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setUserId(null);
      setInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user.id ?? null));

    supabase.auth.getSession().finally(() => setInitialized(true));

    return () => sub.subscription.unsubscribe();
  }, [setInitialized, setUserId]);

  return {
    initialized,
    isSupabaseConfigured,
    userId,
    login: (email: string, password: string) => supabase?.auth.signInWithPassword({ email, password }),
    signup: (email: string, password: string) => supabase?.auth.signUp({ email, password }),
    logout: () => supabase?.auth.signOut(),
    forgotPassword: (email: string) => supabase?.auth.resetPasswordForEmail(email),
    loginWithGoogle: () => supabase?.auth.signInWithOAuth({ provider: 'google' }),
    loginWithLine: () => supabase?.auth.signInWithOAuth({ provider: 'line' })
  };
};
