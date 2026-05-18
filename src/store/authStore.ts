import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

type AuthStatus = 'idle' | 'loading' | 'ready';

type AuthState = {
  session: Session | null;
  status: AuthStatus;
  setSession: (session: Session | null) => void;
  setStatus: (status: AuthStatus) => void;
  isAuthenticated: () => boolean;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  status: 'idle',
  setSession: (session) => set({ session }),
  setStatus: (status) => set({ status }),
  isAuthenticated: () => Boolean(get().session?.user?.id),
  reset: () =>
    set({
      session: null,
      status: 'idle'
    })
}));
