import { create } from 'zustand';

type Toast = { id: number; message: string };
const useToastStore = create<{ toasts: Toast[]; push: (message: string) => void }>((set) => ({
  toasts: [],
  push: (message) => set((s) => ({ toasts: [...s.toasts, { id: Date.now(), message }] }))
}));

export const pushToast = (message: string) => useToastStore.getState().push(message);
export const ToastHost = () => {
  const toasts = useToastStore((s) => s.toasts);
  const visibleToasts = toasts.slice(-3);
  return <div className="fixed top-2 inset-x-0 max-w-md mx-auto space-y-2 px-2">{visibleToasts.map((t) => <div key={t.id} className="glass rounded-xl p-3 text-sm">{t.message}</div>)}</div>;
};
