import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, User, Key, ArrowRight, Coffee } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/60 backdrop-blur-md p-4">
      <div className={`bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
        <div className="bg-espresso p-8 text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Coffee className="w-16 h-16 rotate-12" />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-cream/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-cream/30">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display text-2xl font-bold text-cream mb-1">Staff Access</h2>
            <p className="text-gold-light text-[10px] opacity-80 uppercase tracking-widest font-bold">Authorized Only</p>
          </div>
        </div>

        <div className="p-8 bg-cream/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-espresso uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray group-focus-within:text-espresso transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-latte/30 focus:outline-none focus:ring-4 focus:ring-espresso/5 shadow-sm transition-all text-espresso text-sm font-medium"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-espresso uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray group-focus-within:text-espresso transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-latte/30 focus:outline-none focus:ring-4 focus:ring-espresso/5 shadow-sm transition-all text-espresso text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-tomato text-[10px] font-bold text-center animate-fade-in bg-tomato/5 py-1.5 rounded-lg">
                Invalid credentials.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-espresso text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-espresso-light shadow-xl transition-all active:scale-[0.98] group text-sm"
            >
              Secure Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-warm-gray font-medium">
            Authorized personnel only.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
