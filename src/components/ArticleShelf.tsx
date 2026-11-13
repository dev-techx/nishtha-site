import { useEffect, useState } from 'react';
import { supabase, type Article } from '@/lib/supabase';
import { BookOpen, Pin, Loader2 } from 'lucide-react';
import ArticleModal from './ArticleModal';

const SPINE_COLORS = [
  { bg: 'linear-gradient(180deg, #5c3d2e, #3d2b1f)', accent: '#b8860b' },
  { bg: 'linear-gradient(180deg, #3d5a3d, #2a4029)', accent: '#d4a017' },
  { bg: 'linear-gradient(180deg, #4a3728, #2c1e14)', accent: '#c9a84c' },
  { bg: 'linear-gradient(180deg, #6b3a3a, #4a2828)', accent: '#d4a017' },
  { bg: 'linear-gradient(180deg, #2c4a5c, #1a3040)', accent: '#c9a84c' },
  { bg: 'linear-gradient(180deg, #5c4a2e, #3d3018)', accent: '#d4a017' },
];

export default function ArticleShelf() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('pinned', { ascending: false })
      .order('pin_rank', { ascending: true, nullsFirst: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticles(data as Article[]);
    }
    setLoading(false);
  };

  const pinnedArticles = articles.filter((a) => a.pinned);
  const regularArticles = articles.filter((a) => !a.pinned);

  const getColor = (idx: number) => SPINE_COLORS[idx % SPINE_COLORS.length];

  // Group articles into shelves of ~6
  const chunkSize = 6;
  const shelves: Article[][] = [];
  for (let i = 0; i < regularArticles.length; i += chunkSize) {
    shelves.push(regularArticles.slice(i, i + chunkSize));
  }

  if (shelves.length === 0 && pinnedArticles.length === 0 && !loading) {
    shelves.push([]);
  }

  return (
    <section id="articles" className="py-16 lg:py-24 library-bg relative min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-ui text-sm uppercase tracking-widest text-library-gold mb-3">
            The Collection
          </p>
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-library-wood-dark mb-6">
            Article Shelves
          </h2>
          <div className="gold-divider mx-auto w-32" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-library-gold animate-spin" />
            <p className="font-ui text-library-ink/60 mt-4">Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Pinned articles — featured display */}
            {pinnedArticles.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Pin size={20} className="text-library-gold" fill="currentColor" />
                  <h3 className="font-serif-display text-2xl font-semibold text-library-cream">
                    Featured
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedArticles
                    .sort((a, b) => (a.pin_rank ?? 99) - (b.pin_rank ?? 99))
                    .map((article, idx) => {
                      const color = getColor(idx);
                      return (
                        <div
                          key={article.id}
                          className="book-cover rounded-xl overflow-hidden cursor-pointer group animate-shelf-appear border border-slate-200"
                          style={{ background: color.bg, boxShadow: '0 8px 24px rgba(30,45,65,0.10)' }}
                          onClick={() => setSelected(article)}
                        >
                          {article.image_url ? (
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={article.image_url}
                                alt={article.heading}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            </div>
                          ) : (
                            <div
                              className="h-56 flex items-center justify-center"
                              style={{ background: color.bg }}
                            >
                              <BookOpen size={48} className="text-library-gold/40" strokeWidth={1} />
                            </div>
                          )}
                          <div className="p-5 paper-bg">
                            <div className="flex items-center gap-2 mb-2">
                              {article.pin_rank && article.pin_rank <= 3 && (
                                <span className="pin-badge">Top {article.pin_rank}</span>
                              )}
                            </div>
                            <h4 className="font-serif-display text-xl font-semibold text-library-wood-dark mb-1 line-clamp-2">
                              {article.heading}
                            </h4>
                            <p className="font-ui text-xs text-library-gold uppercase tracking-wide mb-2">
                              {article.name}
                            </p>
                            <p className="font-body text-sm text-library-ink/70 line-clamp-3">
                              {article.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Regular articles — bookshelf display */}
            {shelves.map((shelf, shelfIdx) => (
              <div key={shelfIdx} className="mb-10">
                <div className="shelf-board h-3 mb-0" />
                <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 px-2 sm:px-4 pt-6 pb-2 flex-wrap min-h-[200px]">
                  {shelf.length === 0 ? (
                    <p className="font-body italic text-library-ink/50 py-12">
                      The shelves are waiting to be filled...
                    </p>
                  ) : (
                    shelf.map((article, bookIdx) => {
                      const color = getColor(shelfIdx * chunkSize + bookIdx);
                      const spineWidth = 48 + (article.heading.length % 20);
                      return (
                        <div
                          key={article.id}
                          className="book-spine book-on-shelf rounded-t-sm rounded-b-md flex flex-col items-center justify-between py-4 px-2 animate-shelf-appear"
                          style={{
                            background: color.bg,
                            width: `${spineWidth}px`,
                            height: '190px',
                            boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 2px rgba(255,255,255,0.1)',
                            borderLeft: `2px solid ${color.accent}40`,
                            borderRight: '1px solid rgba(0,0,0,0.3)',
                            animationDelay: `${bookIdx * 0.08}s`,
                          }}
                          onClick={() => setSelected(article)}
                        >
                          <div
                            className="w-full h-1 rounded-full mb-3"
                            style={{ background: color.accent, opacity: 0.6 }}
                          />
                          <p
                            className="font-serif-display text-xs font-semibold text-library-cream text-center leading-tight"
                            style={{
                              writingMode: 'vertical-rl',
                              textOrientation: 'mixed',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxHeight: '130px',
                            }}
                          >
                            {article.heading}
                          </p>
                          <div
                            className="w-full h-1 rounded-full mt-3"
                            style={{ background: color.accent, opacity: 0.6 }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="shelf-board h-4" />
              </div>
            ))}
          </>
        )}
      </div>

      {selected && (
        <ArticleModal article={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
