import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { userId, initialized, isSupabaseConfigured } = useAuth();

  if (!initialized) {
    return <div className="p-4">Loading…</div>;
  }

  if (!isSupabaseConfigured) {
    return children;
  }

  return userId ? children : <Navigate to="/auth" replace />;
};
