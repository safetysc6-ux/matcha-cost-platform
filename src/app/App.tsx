import { Suspense } from 'react';
import { AppRouter } from './router';
import { ToastHost } from '@/components/ui/Toast';

export const App = () => (
  <Suspense fallback={<div className="p-4">Loading…</div>}>
    <AppRouter />
    <ToastHost />
  </Suspense>
);
