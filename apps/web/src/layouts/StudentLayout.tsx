import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, User, LayoutDashboard, Briefcase, Bell } from 'lucide-react';

export default function StudentLayout() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col p-4 space-y-6">
        <div className="text-2xl font-bold text-primary px-2">SSPMS</div>
        <nav className="flex-1 space-y-1">
          <Link to="/student" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/student/opportunities" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <Briefcase className="h-4 w-4" /> Opportunities
          </Link>
          <Link to="/student/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-accent text-foreground">
            <User className="h-4 w-4" /> My Profile
          </Link>
          <Link to="/student/notifications" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" /> Notifications
          </Link>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive text-left">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
