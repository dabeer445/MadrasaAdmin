import { useAuth } from '../services/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Settings() {
  const { logout } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    qc.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6 max-w-sm">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Session</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
