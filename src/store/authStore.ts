import { create } from 'zustand';

type AuthState = {
  userId: string | null;
  initialized: boolean;
  setUserId: (userId: string | null) => void;
  setInitialized: (initialized: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  initialized: false,
  setUserId: (userId) => set({ userId }),
  setInitialized: (initialized) => set({ initialized })
}));
