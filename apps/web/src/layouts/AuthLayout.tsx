import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';

export default function AuthLayout() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to={user.role === 'STUDENT' ? '/student/profile' : '/admin'} replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">SSPMS</h1>
        <Outlet />
      </div>
    </div>
  );
}
