import { create } from 'zustand';

type AuthState = { userId: string | null; setUserId: (userId: string | null) => void };
export const useAuthStore = create<AuthState>((set) => ({ userId: null, setUserId: (userId) => set({ userId }) }));
