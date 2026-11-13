import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        setStatus('error');
        setMessage('You are already subscribed. Thank you!');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } else {
      setStatus('success');
      setMessage('Thank you for subscribing! You will receive our newsletter soon.');
      setEmail('');
    }
  };

  return (
    <section id="newsletter" className="py-20 lg:py-28 library-bg relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="paper-bg rounded-lg shadow-lg p-8 md:p-12 text-center ornament">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-library-wood-dark/5 mb-6">
            <Mail size={32} className="text-library-wood-mid" strokeWidth={1.5} />
          </div>

          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-bold text-library-wood-dark mb-3">
            Subscribe to Our Newsletter
          </h2>
          <div className="gold-divider mx-auto w-24 my-4" />
          <p className="font-body text-base md:text-lg text-library-ink/70 max-w-2xl mx-auto mb-8">
            Stay informed on governance discourse, policy analysis, and public administration
            insights. Join our community of informed readers.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input-library flex-1"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <div className="flex items-center justify-center gap-2 mt-4 text-library-green animate-fade-in">
                <CheckCircle size={18} />
                <span className="font-body text-sm">{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center justify-center gap-2 mt-4 text-library-red animate-fade-in">
                <AlertCircle size={18} />
                <span className="font-body text-sm">{message}</span>
              </div>
            )}
          </form>

          <p className="font-ui text-xs text-library-wood-mid/60 mt-6">
            We respect your privacy. Your email is safe with us.
          </p>
        </div>
      </div>
    </section>
  );
}
