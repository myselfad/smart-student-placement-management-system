import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, LayoutDashboard, Building, Users, FileText,
  Megaphone, Bell, Menu, X, Settings, GraduationCap,
  ChevronDown
} from 'lucide-react';
import { cn } from '../components/ui/Button';

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Placement Drives', href: '/admin/drives', icon: Building },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
];

const bottomItems = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function NavLink({ item, location }: { item: typeof navItems[0]; location: any }) {
  const isActive = item.exact
    ? location.pathname === item.href
    : location.pathname.startsWith(item.href);

  return (
    <Link
      to={item.href}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative select-none',
        isActive
          ? 'bg-blue-600/10 text-blue-400'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="admin-nav-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-500"
        />
      )}
      <item.icon className={cn(
        'h-4 w-4 flex-shrink-0 transition-colors',
        isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
      )} />
      <span className="flex-1">{item.name}</span>
    </Link>
  );
}

function SidebarContent({ location, logout, user }: { location: any; logout: () => void; user: any }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AD';
  const name = user?.email?.split('@')[0] || 'Admin';
  const role = user?.role?.replace(/_/g, ' ').toLowerCase() || 'administrator';

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'hsl(213 26% 16%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(210 100% 45%)' }}>
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-white leading-none">SSPMS</div>
            <div className="text-[10px] mt-0.5 font-medium tracking-wider uppercase"
              style={{ color: 'hsl(213 13% 55%)' }}>Admin Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'hsl(213 13% 42%)' }}>Main Menu</span>
        </div>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} location={location} />
        ))}

        <div className="px-3 mt-5 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'hsl(213 13% 42%)' }}>System</span>
        </div>
        {bottomItems.map((item) => (
          <NavLink key={item.href} item={{ ...item, exact: false }} location={location} />
        ))}
      </nav>

      {/* Profile card */}
      <div className="px-3 pb-4 pt-3 border-t" style={{ borderColor: 'hsl(213 26% 16%)' }}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 hover:bg-white/[0.05] group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'hsl(210 100% 45%)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[13px] font-semibold text-slate-200 truncate capitalize">{name}</div>
            <div className="text-[10px] capitalize" style={{ color: 'hsl(213 13% 55%)' }}>{role}</div>
          </div>
          <ChevronDown className={cn(
            'h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200',
            profileOpen ? 'rotate-180' : ''
          )} style={{ color: 'hsl(213 13% 55%)' }} />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <button
                onClick={logout}
                className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400 text-slate-400"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getBreadcrumb(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return 'Overview';
  const last = parts[parts.length - 1];
  if (/^[0-9a-f-]{20,}$/.test(last)) return 'Details';
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(210 17% 98%)' }}>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[240px] fixed inset-y-0 z-30"
        style={{ background: 'hsl(213 26% 10%)', borderRight: '1px solid hsl(213 26% 16%)' }}
      >
        <SidebarContent location={location} logout={logout} user={user} />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[240px] lg:hidden"
              style={{ background: 'hsl(213 26% 10%)', borderRight: '1px solid hsl(213 26% 16%)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent location={location} logout={logout} user={user} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-[240px] min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 font-medium">Admin</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-800">{getBreadcrumb(location.pathname)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'hsl(210 100% 40%)' }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
