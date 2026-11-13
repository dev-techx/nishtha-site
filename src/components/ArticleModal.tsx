import { useEffect } from 'react';
import { X, User, Calendar } from 'lucide-react';
import type { Article } from '@/lib/supabase';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderDescription = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.trim() === '') {
        return <div key={idx} className="h-4" />;
      }
      return (
        <p key={idx} className="font-body text-base md:text-lg text-library-ink leading-relaxed mb-3">
          {line}
        </p>
      );
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative book-page rounded-lg max-w-3xl w-full max-h-[92vh] overflow-y-auto animate-fade-in-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="sticky top-0 z-10 wood-bg px-6 py-3 flex items-center justify-between rounded-t-lg">
          <span className="font-ui text-xs uppercase tracking-widest text-library-gold-light">
            NISHTHA Publication
          </span>
          <button
            onClick={onClose}
            className="text-library-cream hover:text-library-gold-light transition-smooth"
            aria-label="Close article"
          >
            <X size={22} />
          </button>
        </div>

        {/* Article content */}
        <div className="p-6 md:p-10">
          {/* Image */}
          {article.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-md max-h-80">
              <img
                src={article.image_url}
                alt={article.heading}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-bold text-library-wood-dark mb-4 leading-tight">
            {article.heading}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-library-wood-light/20">
            <div className="flex items-center gap-2 text-library-wood-mid">
              <User size={16} strokeWidth={1.5} />
              <span className="font-ui text-sm">{article.name}</span>
            </div>
            <div className="flex items-center gap-2 text-library-wood-mid">
              <Calendar size={16} strokeWidth={1.5} />
              <span className="font-ui text-sm">{formatDate(article.created_at)}</span>
            </div>
            {article.pinned && (
              <span className="pin-badge">Featured</span>
            )}
          </div>

          {/* Body */}
          <div className="prose-library">
            {renderDescription(article.description)}
          </div>

          {/* Footer ornament */}
          <div className="mt-8 pt-6 border-t border-library-wood-light/20 text-center">
            <div className="gold-divider mx-auto w-24" />
            <p className="font-serif-display text-sm text-library-wood-mid italic mt-3">
              NISHTHA — Knowledge for Governance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
