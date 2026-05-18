import { useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthResult = {
  ok: boolean;
  message?: string;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address.';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
};

const notConfiguredResult = (): AuthResult => ({
  ok: false,
  message: 'Authentication is not configured. Missing Supabase environment variables.'
});

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
    login: async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase || !isSupabaseConfigured) return notConfiguredResult();
      const emailError = validateEmail(email);
      if (emailError) return { ok: false, message: emailError };
      const passwordError = validatePassword(password);
      if (passwordError) return { ok: false, message: passwordError };

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) return { ok: false, message: error.message };
      return { ok: true };
    },
    signup: async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase || !isSupabaseConfigured) return notConfiguredResult();
      const emailError = validateEmail(email);
      if (emailError) return { ok: false, message: emailError };
      const passwordError = validatePassword(password);
      if (passwordError) return { ok: false, message: passwordError };

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) return { ok: false, message: error.message };
      return { ok: true, message: 'Signup successful. Check your email for verification.' };
    },
    logout: async (): Promise<AuthResult> => {
      if (!supabase || !isSupabaseConfigured) return notConfiguredResult();
      const { error } = await supabase.auth.signOut();
      if (error) return { ok: false, message: error.message };
      return { ok: true };
    },
    forgotPassword: async (email: string): Promise<AuthResult> => {
      if (!supabase || !isSupabaseConfigured) return notConfiguredResult();
      const emailError = validateEmail(email);
      if (emailError) return { ok: false, message: emailError };

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) return { ok: false, message: error.message };
      return { ok: true, message: 'Password reset email sent.' };
    },
    loginWithGoogle: () =>
      supabase?.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth` }
      }),
    loginWithLine: () =>
      supabase?.auth.signInWithOAuth({
        provider: 'line',
        options: { redirectTo: `${window.location.origin}/auth` }
      })
  };
};
