import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, initialized, loading, isSupabaseConfigured } = useAuth();

  if (!initialized || loading) {
    return <div className="page-loader">Loading your workspace…</div>;
  }

  if (!isSupabaseConfigured) {
    return children;
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};
