import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
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

let setupDone = false;

const applySession = (session: Session | null) => {
  const state = useAuthStore.getState();
  state.setSession(session);
  state.setStatus('ready');
};

const initializeAuth = async () => {
  const state = useAuthStore.getState();

  if (!isSupabaseConfigured || !supabase) {
    state.setSession(null);
    state.setStatus('ready');
    return;
  }

  if (state.status === 'loading' || state.status === 'ready') {
    return;
  }

  state.setStatus('loading');

  const { data } = await supabase.auth.getSession();
  applySession(data.session ?? null);

  if (!setupDone) {
    setupDone = true;
    supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session ?? null);
    });
  }
};

export const useAuth = () => {
  const { session, status, isAuthenticated } = useAuthStore();

  useEffect(() => {
    void initializeAuth();
  }, []);

  return {
    session,
    initialized: status === 'ready',
    loading: status !== 'ready',
    isSupabaseConfigured,
    userId: session?.user?.id ?? null,
    isAuthenticated: isAuthenticated(),
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
      useAuthStore.getState().setSession(null);
      return { ok: true, message: 'Logged out.' };
    }
  };
};
