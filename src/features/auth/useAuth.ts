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

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUserId(data?.session?.user?.id ?? null);
      })
      .catch(() => {
        if (!active) return;
        setUserId(null);
      })
      .finally(() => {
        if (!active) return;
        setInitialized(true);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!active) return;
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
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
