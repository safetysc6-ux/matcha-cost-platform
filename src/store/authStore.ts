import { create } from 'zustand';

type AuthState = {
  userId: string | null;
  initialized: boolean;
  initializing: boolean;
  setUserId: (userId: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  initialized: false,
  initializing: false,
  setUserId: (userId) => set({ userId }),
  setInitialized: (initialized) => set({ initialized }),
  setInitializing: (initializing) => set({ initializing }),
  reset: () =>
    set({
      userId: null,
      initialized: false,
      initializing: false
    })
}));
