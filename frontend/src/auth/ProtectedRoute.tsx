import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ role }: { role?: 'dean' | 'applicant' }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to={role === 'dean' ? '/admin/login' : '/applicant/login'} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'dean' ? '/admin' : '/programs'} replace />;
  }

  return <Outlet />;
}
