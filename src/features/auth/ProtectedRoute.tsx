import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { userId } = useAuth();
  return userId ? children : <Navigate to="/auth" replace />;
};
