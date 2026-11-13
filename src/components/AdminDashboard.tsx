import { useEffect, useState, useCallback } from 'react';
import { supabase, type Article, type Subscriber } from '@/lib/supabase';
import { generateNewsletterPDF } from '@/lib/pdfGenerator';
import {
  LogOut, Plus, Pin, PinOff, Trash2, Edit3, X, Check, Loader2,
  Search, FileText, Download, Mail, Users, Eye, EyeOff,
  ChevronUp, ChevronDown, CheckSquare, Square, Image as ImageIcon,
  ArrowLeft, AlertCircle, Save,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onBack: () => void;
}

type Tab = 'articles' | 'subscribers';

interface EditForm {
  id?: string;
  name: string;
  heading: string;
  description: string;
  image_url: string;
}

const EMPTY_FORM: EditForm = {
  name: '',
  heading: '',
  description: '',
  image_url: '',
};

export default function AdminDashboard({ onLogout, onBack }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [artRes, subRes] = await Promise.all([
      supabase
        .from('articles')
        .select('*')
        .order('pinned', { ascending: false })
        .order('pin_rank', { ascending: true, nullsFirst: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
    ]);
    if (artRes.data) setArticles(artRes.data as Article[]);
    if (subRes.data) setSubscribers(subRes.data as Subscriber[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // --- Article CRUD ---
  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.heading.trim() || !editForm.description.trim()) {
      showError('Name, heading, and description are required.');
      return;
    }
    setSaving(true);
    const payload = {
      name: editForm.name.trim(),
      heading: editForm.heading.trim(),
      description: editForm.description.trim(),
      image_url: editForm.image_url.trim() || null,
    };

    if (editForm.id) {
      const { error } = await supabase
        .from('articles')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editForm.id);
      if (error) showError('Failed to update article.');
      else showSuccess('Article updated successfully.');
    } else {
      const { error } = await supabase.from('articles').insert(payload);
      if (error) showError('Failed to create article.');
      else showSuccess('Article created successfully.');
    }

    setSaving(false);
    setShowForm(false);
    setEditForm(EMPTY_FORM);
    fetchData();
  };

  const handleEdit = (article: Article) => {
    setEditForm({
      id: article.id,
      name: article.name,
      heading: article.heading,
      description: article.description,
      image_url: article.image_url || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) showError('Failed to delete article.');
    else showSuccess('Article deleted.');
    fetchData();
  };

  const handleClearText = () => {
    setEditForm(EMPTY_FORM);
  };

  // --- Pin management ---
  const togglePin = async (article: Article) => {
    if (!article.pinned) {
      const pinnedCount = articles.filter((a) => a.pinned).length;
      if (pinnedCount >= 3) {
        showError('Maximum 3 articles can be pinned. Unpin one first.');
        return;
      }
      const maxRank = Math.max(
        0,
        ...articles.filter((a) => a.pinned && a.pin_rank).map((a) => a.pin_rank as number),
      );
      const { error } = await supabase
        .from('articles')
        .update({ pinned: true, pin_rank: maxRank + 1 })
        .eq('id', article.id);
      if (error) showError('Failed to pin article.');
      else showSuccess('Article pinned.');
    } else {
      const { error } = await supabase
        .from('articles')
        .update({ pinned: false, pin_rank: null })
        .eq('id', article.id);
      if (error) showError('Failed to unpin article.');
      else showSuccess('Article unpinned.');
    }
    fetchData();
  };

  const changePinRank = async (article: Article, direction: 'up' | 'down') => {
    const pinned = articles.filter((a) => a.pinned).sort((a, b) => (a.pin_rank ?? 0) - (b.pin_rank ?? 0));
    const currentIdx = pinned.findIndex((a) => a.id === article.id);
    if (currentIdx === -1) return;
    const swapIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (swapIdx < 0 || swapIdx >= pinned.length) return;
    const swapArticle = pinned[swapIdx];
    const currentRank = article.pin_rank as number;
    const swapRank = swapArticle.pin_rank as number;

    await Promise.all([
      supabase.from('articles').update({ pin_rank: swapRank }).eq('id', article.id),
      supabase.from('articles').update({ pin_rank: currentRank }).eq('id', swapArticle.id),
    ]);
    fetchData();
  };

  // --- Sort order ---
  const changeSortOrder = async (article: Article, direction: 'up' | 'down') => {
    const sorted = [...articles].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((a) => a.id === article.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapArticle = sorted[swapIdx];
    await Promise.all([
      supabase.from('articles').update({ sort_order: swapArticle.sort_order }).eq('id', article.id),
      supabase.from('articles').update({ sort_order: article.sort_order }).eq('id', swapArticle.id),
    ]);
    fetchData();
  };

  // --- Bulk operations ---
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredArticles.map((a) => a.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected articles? This cannot be undone.`)) return;
    const { error } = await supabase
      .from('articles')
      .delete()
      .in('id', Array.from(selectedIds));
    if (error) showError('Failed to delete articles.');
    else {
      showSuccess(`${selectedIds.size} articles deleted.`);
      setSelectedIds(new Set());
    }
    fetchData();
  };

  // --- Subscriber management ---
  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (error) showError('Failed to remove subscriber.');
    else showSuccess('Subscriber removed.');
    fetchData();
  };

  const exportSubscribers = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriber.txt';
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Subscribers exported to subscriber.txt');
  };

  // --- PDF Generation ---
  const handleGeneratePDF = () => {
    if (articles.length === 0) {
      showError('No articles to include in the newsletter.');
      return;
    }
    setGeneratingPDF(true);
    try {
      generateNewsletterPDF(articles);
      showSuccess('Newsletter PDF generated successfully.');
    } catch {
      showError('Failed to generate PDF.');
    }
    setGeneratingPDF(false);
  };

  // --- Filtered articles ---
  const filteredArticles = articles.filter(
    (a) =>
      a.heading.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()),
  );

  const pinnedCount = articles.filter((a) => a.pinned).length;

  return (
    <div className="min-h-screen library-bg">
      {/* Top bar */}
      <div className="wood-bg sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-library-cream/70 hover:text-library-gold-light transition-smooth"
              aria-label="Back to website"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-serif-display text-xl font-bold text-library-cream">
              NISHTHA Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 font-ui text-sm text-library-cream/70 hover:text-library-gold-light transition-smooth"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-library-wood-light/30">
          <button
            onClick={() => setTab('articles')}
            className={`flex items-center gap-2 px-5 py-3 font-ui text-sm font-medium border-b-2 transition-smooth ${
              tab === 'articles'
                ? 'border-library-gold text-library-wood-dark'
                : 'border-transparent text-library-wood-mid/60 hover:text-library-wood-dark'
            }`}
          >
            <FileText size={16} />
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setTab('subscribers')}
            className={`flex items-center gap-2 px-5 py-3 font-ui text-sm font-medium border-b-2 transition-smooth ${
              tab === 'subscribers'
                ? 'border-library-gold text-library-wood-dark'
                : 'border-transparent text-library-wood-mid/60 hover:text-library-wood-dark'
            }`}
          >
            <Mail size={16} />
            Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 bg-library-red/10 text-library-red px-4 py-3 rounded-md mb-4 font-ui text-sm animate-fade-in">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-library-green/10 text-library-green px-4 py-3 rounded-md mb-4 font-ui text-sm animate-fade-in">
            <Check size={18} />
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={36} className="text-library-gold animate-spin" />
          </div>
        ) : tab === 'articles' ? (
          <>
            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={() => {
                  setEditForm(EMPTY_FORM);
                  setShowForm(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                New Article
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={generatingPDF}
                className="btn-gold flex items-center gap-2 disabled:opacity-60"
              >
                {generatingPDF ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
                Generate Newsletter PDF
              </button>
              {selectedIds.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-library-red text-white rounded-md font-ui text-sm font-medium hover:bg-library-red/80 transition-smooth"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedIds.size})
                </button>
              )}
              <div className="relative flex-1 min-w-[180px] max-w-xs ml-auto">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-library-wood-light"
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-library pl-9 py-2 text-sm"
                />
              </div>
            </div>

            {/* Pinned counter */}
            <p className="font-ui text-xs text-library-wood-mid/60 mb-4">
              {pinnedCount}/3 articles pinned
            </p>

            {/* Articles list */}
            <div className="space-y-3">
              {/* Select all */}
              {filteredArticles.length > 0 && (
                <div className="flex items-center gap-3 paper-bg rounded-md px-4 py-2">
                  <button onClick={toggleSelectAll} className="text-library-wood-mid hover:text-library-gold">
                    {selectedIds.size === filteredArticles.length && filteredArticles.length > 0 ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                  <span className="font-ui text-sm text-library-wood-mid">
                    {selectedIds.size === filteredArticles.length && filteredArticles.length > 0
                      ? 'Deselect All'
                      : 'Select All'}
                  </span>
                </div>
              )}

              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className={`paper-bg rounded-lg p-4 shadow-sm transition-smooth ${
                    selectedIds.has(article.id) ? 'ring-2 ring-library-gold' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Select checkbox */}
                    <button
                      onClick={() => toggleSelect(article.id)}
                      className="mt-1 text-library-wood-mid hover:text-library-gold transition-smooth"
                    >
                      {selectedIds.has(article.id) ? (
                        <CheckSquare size={20} />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>

                    {/* Image thumbnail */}
                    {article.image_url && (
                      <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-library-wood-dark/10">
                        <img
                          src={article.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {article.pinned && (
                          <span className="pin-badge">
                            {article.pin_rank ? `Top ${article.pin_rank}` : 'Pinned'}
                          </span>
                        )}
                        <h3 className="font-serif-display text-lg font-semibold text-library-wood-dark truncate">
                          {article.heading}
                        </h3>
                      </div>
                      <p className="font-ui text-xs text-library-gold uppercase tracking-wide mb-1">
                        {article.name}
                      </p>
                      <p className="font-body text-sm text-library-ink/60 line-clamp-2">
                        {article.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 flex-shrink-0">
                      {/* Pin */}
                      <button
                        onClick={() => togglePin(article)}
                        className={`p-2 rounded-md transition-smooth ${
                          article.pinned
                            ? 'text-library-gold hover:bg-library-gold/10'
                            : 'text-library-wood-mid/50 hover:text-library-gold hover:bg-library-gold/5'
                        }`}
                        title={article.pinned ? 'Unpin' : 'Pin'}
                      >
                        {article.pinned ? <Pin size={16} fill="currentColor" /> : <PinOff size={16} />}
                      </button>

                      {/* Pin rank arrows */}
                      {article.pinned && (
                        <div className="flex flex-col">
                          <button
                            onClick={() => changePinRank(article, 'up')}
                            className="text-library-wood-mid/50 hover:text-library-gold p-0.5 transition-smooth"
                            title="Move pin up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => changePinRank(article, 'down')}
                            className="text-library-wood-mid/50 hover:text-library-gold p-0.5 transition-smooth"
                            title="Move pin down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      )}

                      {/* Sort order */}
                      <div className="flex flex-col">
                        <button
                          onClick={() => changeSortOrder(article, 'up')}
                          className="text-library-wood-mid/50 hover:text-library-wood-dark p-0.5 transition-smooth"
                          title="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => changeSortOrder(article, 'down')}
                          className="text-library-wood-mid/50 hover:text-library-wood-dark p-0.5 transition-smooth"
                          title="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 rounded-md text-library-wood-mid hover:text-library-gold hover:bg-library-gold/5 transition-smooth"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 rounded-md text-library-wood-mid hover:text-library-red hover:bg-library-red/5 transition-smooth"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredArticles.length === 0 && (
                <div className="paper-bg rounded-lg p-12 text-center">
                  <FileText size={40} className="mx-auto text-library-wood-light/30 mb-4" />
                  <p className="font-body text-library-wood-mid/60">
                    {search ? 'No articles match your search.' : 'No articles yet. Create your first article!'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Subscribers tab */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={exportSubscribers}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={18} />
                Export subscriber.txt
              </button>
              <div className="flex items-center gap-2 font-ui text-sm text-library-wood-mid bg-library-gold/10 px-4 py-2 rounded-md">
                <Users size={16} className="text-library-gold" />
                {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="paper-bg rounded-lg shadow-sm overflow-hidden">
              {subscribers.length > 0 ? (
                <div className="divide-y divide-library-wood-light/15">
                  {subscribers.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-library-gold/5 transition-smooth"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Mail size={18} className="text-library-wood-mid flex-shrink-0" />
                        <span className="font-body text-sm text-library-ink truncate">
                          {sub.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-ui text-xs text-library-wood-mid/50 hidden sm:block">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="p-1.5 rounded-md text-library-wood-mid hover:text-library-red hover:bg-library-red/5 transition-smooth"
                          title="Remove subscriber"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Mail size={40} className="mx-auto text-library-wood-light/30 mb-4" />
                  <p className="font-body text-library-wood-mid/60">
                    No subscribers yet. Once people subscribe, they will appear here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit/Create modal */}
      {showForm && (
        <ArticleFormModal
          form={editForm}
          onChange={setEditForm}
          onSave={handleSave}
          onClear={handleClearText}
          onClose={() => {
            setShowForm(false);
            setEditForm(EMPTY_FORM);
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

// --- Article Form Modal ---
interface ArticleFormModalProps {
  form: EditForm;
  onChange: (form: EditForm) => void;
  onSave: () => void;
  onClear: () => void;
  onClose: () => void;
  saving: boolean;
}

function ArticleFormModal({
  form,
  onChange,
  onSave,
  onClear,
  onClose,
  saving,
}: ArticleFormModalProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative book-page rounded-lg max-w-2xl w-full max-h-[92vh] overflow-y-auto animate-fade-in-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 wood-bg px-6 py-3 flex items-center justify-between rounded-t-lg">
          <h2 className="font-serif-display text-lg font-bold text-library-cream">
            {form.id ? 'Edit Article' : 'New Article'}
          </h2>
          <button
            onClick={onClose}
            className="text-library-cream hover:text-library-gold-light transition-smooth"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">
              Name <span className="text-library-red">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="Author or source name"
              className="input-library"
            />
          </div>

          {/* Heading */}
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">
              Heading <span className="text-library-red">*</span>
            </label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => onChange({ ...form, heading: e.target.value })}
              placeholder="Article title"
              className="input-library"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">
              Image <span className="font-ui text-xs text-library-wood-mid/50">(Optional — URL or path)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => onChange({ ...form, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="input-library flex-1"
              />
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-outline flex items-center gap-1.5 whitespace-nowrap"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
            {showPreview && form.image_url && (
              <div className="mt-2 rounded-md overflow-hidden h-40 bg-library-wood-dark/5">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML =
                      '<div class="flex items-center justify-center h-full text-library-wood-mid/40 font-ui text-sm">Image could not load</div>';
                  }}
                />
              </div>
            )}
            {showPreview && !form.image_url && (
              <div className="mt-2 rounded-md h-40 bg-library-wood-dark/5 flex items-center justify-center">
                <ImageIcon size={32} className="text-library-wood-mid/30" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-ui text-sm font-medium text-library-wood-dark mb-1.5">
              Article Description <span className="text-library-red">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              placeholder="Write the full article content here..."
              rows={10}
              className="input-library resize-y font-body"
            />
            <p className="font-ui text-xs text-library-wood-mid/50 mt-1">
              {form.description.length} characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-library-wood-light/20">
            <button
              onClick={onSave}
              disabled={saving}
              className="btn-gold flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {form.id ? 'Update Article' : 'Publish Article'}
            </button>
            <button
              onClick={onClear}
              className="btn-outline flex items-center gap-1.5"
            >
              <X size={16} />
              Clear Text
            </button>
            <button
              onClick={onClose}
              className="btn-outline ml-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
