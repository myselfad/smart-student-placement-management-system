import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './features/auth/Login';
import StudentProfile from './features/profile/StudentProfile';
import Opportunities from './features/drives/Opportunities';
import DriveDetail from './features/drives/DriveDetail';
import MyApplications from './features/applications/MyApplications';
import AdminDrives from './features/admin/AdminDrives';
import AdminDriveApplicants from './features/admin/AdminDriveApplicants';
import StudentDashboard from './features/dashboard/StudentDashboard';
import AdminDashboard from './features/dashboard/AdminDashboard';
import NotificationsList from './features/notifications/NotificationsList';

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public / Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<DriveDetail />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="notifications" element={<NotificationsList />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="drives/:id/applicants" element={<AdminDriveApplicants />} />
          </Route>

          {/* Default Route */}
          <Route path="*" element={<Navigate to={user?.role === 'STUDENT' ? '/student' : user ? '/admin' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
