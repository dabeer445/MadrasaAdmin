import { useAuth } from '../services/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@heroui/react';
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
    <div className="space-y-6 max-w-sm fade-up">
      <h1 className="page-title">Settings</h1>

      <Card className="p-5 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Session</p>
        <Button
          variant="danger"
          onPress={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </Card>
    </div>
  );
}
