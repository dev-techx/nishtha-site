import { useState } from 'react';
import { Lock, User, ArrowLeft, BookOpen, EyeOff } from 'lucide-react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@/lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('nishta_admin', 'authenticated');
      onSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen wood-bg flex items-center justify-center px-4">
      <div className="paper-bg rounded-lg shadow-2xl p-8 md:p-10 max-w-md w-full ornament">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full wood-bg mb-4">
            <BookOpen size={28} className="text-library-gold-light" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif-display text-3xl font-bold text-library-wood-dark">
            Admin Panel
          </h1>
          <p className="font-ui text-sm text-library-wood-mid/60 mt-2">
            NISHTHA Publication Management
          </p>
          <div className="gold-divider mx-auto w-16 my-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">
              Username
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-library-wood-light"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter username"
                className="input-library pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-library-wood-light"
                strokeWidth={1.5}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                className="input-library pl-10"
                autoComplete="off"
              />
              <EyeOff
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-library-wood-light/50"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-library-red font-ui text-sm bg-library-red/10 rounded-md px-4 py-2 animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Lock size={16} strokeWidth={2} />
            Sign In
          </button>
        </form>

        {/* Back */}
        <button
          onClick={onBack}
          className="mt-6 flex items-center gap-2 font-ui text-sm text-library-wood-mid hover:text-library-wood-dark transition-smooth mx-auto"
        >
          <ArrowLeft size={16} />
          Back to Website
        </button>
      </div>
    </div>
  );
}
