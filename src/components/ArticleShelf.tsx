import { useEffect, useState } from 'react';
import { supabase, type Article, type MagazineIssue } from '@/lib/supabase';
import { BookOpen, Pin, Loader2, Scale, Globe, Users } from 'lucide-react';
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
  const [issues,setIssues]=useState<MagazineIssue[]>([]);
  const [activeIssue,setActiveIssue]=useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
    supabase.from('magazine_issues').select('*').order('issue_number',{ascending:false}).then(({data})=>{const list=(data||[]) as MagazineIssue[];setIssues(list);setActiveIssue(list[0]?.id||'');});
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
        <div className="text-left mb-12">
          <p className="font-ui text-sm uppercase tracking-widest text-library-gold mb-3">
            INSIGHTS & ANALYSIS
          </p>
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-library-wood-dark mb-6">
            Latest Articles
          </h2>
          <div className="gold-divider mx-auto w-32" />
        </div>

        {issues.length>0&&<div className="flex flex-wrap items-center justify-between gap-3 mb-8 rounded-xl border border-slate-200 bg-white p-4"><div><p className="text-xs uppercase tracking-widest text-[#a8792c]">Magazine archive</p><h3 className="text-xl font-semibold text-[#142640]">{issues.find(i=>i.id===activeIssue)?.title||'Latest Issue'}</h3></div><select aria-label="Browse magazine issue" value={activeIssue} onChange={e=>setActiveIssue(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[#142640]">{issues.map(i=><option key={i.id} value={i.id}>Issue {String(i.issue_number).padStart(2,'0')} — {i.title}</option>)}</select></div>}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-library-gold animate-spin" />
            <p className="font-ui text-library-ink/60 mt-4">Loading articles...</p>
          </div>
        ) : (
          <>
            {issueArticles.length===0&&<div className='text-center py-12 text-slate-500'>No articles have been published in this issue yet.</div>}
            {/* Pinned articles — featured display */}
            {pinnedArticles.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Pin size={20} className="text-library-gold" fill="currentColor" />
                  <h3 className="font-serif-display text-2xl font-semibold text-library-cream">
                    Editor's Picks
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

            {/* Regular articles — clean editorial cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {regularArticles.map((article) => (
                <article key={article.id} onClick={() => setSelected(article)} className="article-editorial-card group cursor-pointer overflow-hidden bg-white rounded-xl border border-slate-200">
                  {article.image_url ? <div className="h-48 overflow-hidden bg-slate-100"><img src={article.image_url} alt={article.heading} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}}/></div> : <div className="h-2 bg-gradient-to-r from-[#26364d] to-[#d4ad68]"/>}
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[.14em] text-slate-500 mb-3">{article.name}</p>
                    <h3 className="text-xl font-semibold leading-snug text-slate-900 mb-3 group-hover:text-[#344b69]">{article.heading}</h3>
                    <p className="text-sm leading-6 text-slate-600 line-clamp-3">{article.description}</p>
                    <div className="mt-5 text-sm font-semibold text-[#344b69]">Read article →</div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="text-center mb-9"><p className="text-xs uppercase tracking-[.18em] text-[#a8792c] mb-2">Our focus areas</p><h2 className="text-3xl sm:text-4xl font-semibold text-[#142640]">Areas of Research</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {icon:Scale,title:'Governance & Reform',text:'Examining public administration, institutional frameworks, and governance reforms that shape effective policy.'},
              {icon:Globe,title:'International Relations',text:'Exploring global affairs, diplomatic discourse, and the evolving dynamics of international cooperation.'},
              {icon:BookOpen,title:'Public Policy',text:'Analyzing policy formulation, social development, and emerging challenges in the public sector.'},
              {icon:Users,title:'Inclusive Dialogue',text:'Bringing together voices from government, academia, civil society, and the research community.'}
            ].map(({icon:Icon,title,text})=><article key={title} className="bg-white border border-slate-200 rounded-xl p-6"><Icon size={25} className="text-[#a8792c] mb-4"/><h3 className="font-semibold text-lg text-[#142640] mb-2">{title}</h3><p className="text-sm leading-6 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </div>

      {selected && (
        <ArticleModal article={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
