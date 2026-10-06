import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth
import Login from './features/auth/Login';

// Admin Pages
import AdminDashboard from './features/dashboard/AdminDashboard';
import AdminDrives from './features/admin/AdminDrives';
import AdminDriveApplicants from './features/admin/AdminDriveApplicants';
import AdminStudents from './features/admin/AdminStudents';
import AdminStudentDetail from './features/admin/AdminStudentDetail';
import AdminApplications from './features/admin/AdminApplications';
import AdminAnnouncements from './features/admin/AdminAnnouncements';

// Student Pages
import StudentDashboard from './features/dashboard/StudentDashboard';
import StudentProfile from './features/profile/StudentProfile';
import Opportunities from './features/drives/Opportunities';
import DriveDetail from './features/drives/DriveDetail';
import MyApplications from './features/applications/MyApplications';
import NotificationsList from './features/notifications/NotificationsList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: '12px',
            color: '#0f172a',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<DriveDetail />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="notifications" element={<NotificationsList />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="drives/:id/applicants" element={<AdminDriveApplicants />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:id" element={<AdminStudentDetail />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Route>

          {/* Default */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  user?.role === 'STUDENT' ? '/student' :
                  user ? '/admin' :
                  '/login'
                }
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
