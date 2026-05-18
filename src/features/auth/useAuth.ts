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
  if (!email.trim()) return 'กรุณากรอกอีเมล';
  if (!EMAIL_REGEX.test(email.trim())) return 'รูปแบบอีเมลไม่ถูกต้อง';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'กรุณากรอกรหัสผ่าน';
  if (password.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  return null;
};

const notConfiguredResult = (): AuthResult => ({
  ok: false,
  message: 'ระบบล็อกอินยังไม่พร้อมใช้งาน กรุณาตั้งค่า Supabase ก่อน'
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

  if (state.status === 'loading' || state.status === 'ready') return;

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

      if (error) return { ok: false, message: 'เข้าสู่ระบบไม่สำเร็จ: ' + error.message };
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
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) return { ok: false, message: 'สมัครสมาชิกไม่สำเร็จ: ' + error.message };
      return { ok: true, message: 'สมัครสำเร็จ กรุณาเช็กอีเมลเพื่อยืนยันบัญชี' };
    },
    signupWithGoogle: async (): Promise<AuthResult> => {
      if (!supabase || !isSupabaseConfigured) return notConfiguredResult();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) return { ok: false, message: 'เชื่อมต่อ Google ไม่สำเร็จ: ' + error.message };
      return { ok: true };
    },
    logout: async (): Promise<AuthResult> => {
      if (!supabase || !isSupabaseConfigured) return notConfiguredResult();
      const { error } = await supabase.auth.signOut();
      if (error) return { ok: false, message: 'ออกจากระบบไม่สำเร็จ: ' + error.message };
      useAuthStore.getState().setSession(null);
      return { ok: true };
    }
  };
};
