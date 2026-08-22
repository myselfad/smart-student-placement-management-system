import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, LayoutDashboard, Building, Users, FileText, Megaphone } from 'lucide-react';

export default function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col p-4 space-y-6">
        <div className="text-2xl font-bold text-primary px-2">SSPMS Admin</div>
        <nav className="flex-1 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/admin/drives" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <Building className="h-4 w-4" /> Placement Drives
          </Link>
          <Link to="/admin/students" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <Users className="h-4 w-4" /> Students
          </Link>
          <Link to="/admin/applications" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <FileText className="h-4 w-4" /> Applications
          </Link>
          <Link to="/admin/announcements" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <Megaphone className="h-4 w-4" /> Announcements
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
