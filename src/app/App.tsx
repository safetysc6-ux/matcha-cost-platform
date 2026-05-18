import { Suspense } from 'react';
import { AppRouter } from './router';
import { ToastHost } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <AppRouter />
      <ToastHost />
    </Suspense>
  </ErrorBoundary>
);
