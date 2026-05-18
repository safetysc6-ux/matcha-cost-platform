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

let authSubscriptionInitialized = false;
let initializePromise: Promise<void> | null = null;

const initializeAuthSession = async () => {
  const state = useAuthStore.getState();
  if (state.initialized || state.initializing) return;

  state.setInitializing(true);
  try {
    const { data } = await supabase!.auth.getSession();
    useAuthStore.getState().setUserId(data?.session?.user?.id ?? null);
  } catch {
    useAuthStore.getState().setUserId(null);
  } finally {
    const current = useAuthStore.getState();
    current.setInitializing(false);
    current.setInitialized(true);
  }
};

const ensureAuthSetup = () => {
  const state = useAuthStore.getState();

  if (!isSupabaseConfigured || !supabase) {
    state.setUserId(null);
    state.setInitializing(false);
    state.setInitialized(true);
    return;
  }

  if (!initializePromise) {
    initializePromise = initializeAuthSession().finally(() => {
      initializePromise = null;
    });
  }

  if (!authSubscriptionInitialized) {
    authSubscriptionInitialized = true;
    supabase.auth.onAuthStateChange(async (event, session) => {
      const nextState = useAuthStore.getState();
      nextState.setUserId(session?.user?.id ?? null);
      nextState.setInitialized(true);

      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        await supabase.auth.getSession();
      }
    });
  }
};

export const useAuth = () => {
  const { userId, setUserId, initialized, initializing } = useAuthStore();

  useEffect(() => {
    ensureAuthSetup();

    if (!isSupabaseConfigured || !supabase) {
      setUserId(null);
    }
  }, [setUserId]);

  return {
    initialized,
    initializing,
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
      return { ok: true, message: 'Login successful.' };
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
      useAuthStore.getState().setUserId(null);
      return { ok: true, message: 'Logged out.' };
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
