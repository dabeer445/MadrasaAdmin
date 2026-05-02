import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Button, Spinner } from '@heroui/react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import type { FormEvent } from 'react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm fade-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold text-zinc-50 tracking-tight">MadrasaCRM</h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Super Admin Portal</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 bg-rose-500/8 border border-rose-500/20 text-rose-400 text-sm rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="field-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                className="field"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="field"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isDisabled={isLoading}
              className="w-full justify-center py-2.5 mt-1"
            >
              {isLoading ? <><Spinner size="sm" /> Signing in…</> : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">Authorised personnel only</p>
      </div>
    </div>
  );
}
