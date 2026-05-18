import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const RecipePage = lazy(() => import('@/pages/RecipePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const RecipeFormPage = lazy(() => import('@/pages/RecipeFormPage'));

export const AppRouter = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipes" element={<RecipePage />} />
      <Route path="/recipes/new" element={<RecipeFormPage />} />
      <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
