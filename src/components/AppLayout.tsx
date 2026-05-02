import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Toast } from '@heroui/react';
import { toastQueue } from '../lib/toast';
import {
  LayoutDashboard, School, Users, Settings, LogOut, Menu, X, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const NAV_ITEMS = [
  { path: '/',         label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/schools',  label: 'Schools',   icon: School },
  { path: '/users',    label: 'Users',     icon: Users },
  { path: '/settings', label: 'Settings',  icon: Settings },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    qc.clear();
    navigate('/login', { replace: true });
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/60">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-zinc-800/60">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-zinc-950" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-50 leading-none">MadrasaCRM</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'nav-active text-zinc-50 bg-zinc-800/60'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/60">
        <Button
          variant="ghost"
          onPress={handleLogout}
          className="w-full justify-start gap-3 px-3 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
          </div>
          <span className="text-sm font-bold text-zinc-100">MadrasaCRM</span>
        </div>
        <Button
          variant="ghost"
          isIconOnly
          onPress={() => setMobileOpen(v => !v)}
          className="text-zinc-400"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky md:top-0 md:h-screen inset-y-0 left-0 w-60 z-50 shrink-0
        transform transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {sidebar}
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto pt-12 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>

      <Toast.Provider queue={toastQueue} placement="bottom end">
        {({ toast }) => (
          <Toast toast={toast} variant={toast.content.variant}>
            <Toast.Indicator />
            <Toast.Content>
              <Toast.Title>{toast.content.title}</Toast.Title>
              {toast.content.description && <Toast.Description>{toast.content.description}</Toast.Description>}
            </Toast.Content>
            <Toast.CloseButton />
          </Toast>
        )}
      </Toast.Provider>
    </div>
  );
}
