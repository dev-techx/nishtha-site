import { useState } from 'react';
import { Lock, Mail, ArrowLeft, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      setError('Sign-in failed. Check your email and password.');
      return;
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen wood-bg flex items-center justify-center px-4">
      <div className="paper-bg rounded-lg shadow-2xl p-8 md:p-10 max-w-md w-full ornament">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full wood-bg mb-4">
            <BookOpen size={28} className="text-library-gold-light" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif-display text-3xl font-bold text-library-wood-dark">Admin Panel</h1>
          <p className="font-ui text-sm text-library-wood-mid/60 mt-2">NISHTHA Publication Management</p>
          <div className="gold-divider mx-auto w-16 my-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">Admin email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-library-wood-light" strokeWidth={1.5} />
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="Admin email" className="input-library pl-10" autoComplete="username" />
            </div>
          </div>
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-library-wood-light" strokeWidth={1.5} />
              <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Password" className="input-library pl-10" autoComplete="current-password" />
            </div>
          </div>
          {error && <div role="alert" className="text-library-red font-ui text-sm bg-library-red/10 rounded-md px-4 py-2 animate-fade-in">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            <Lock size={16} strokeWidth={2} />{loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <button onClick={onBack} className="mt-6 flex items-center gap-2 font-ui text-sm text-library-wood-mid hover:text-library-wood-dark transition-smooth mx-auto">
          <ArrowLeft size={16} />Back to Website
        </button>
      </div>
    </div>
  );
}
