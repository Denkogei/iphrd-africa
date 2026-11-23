// src/pages/Publications.jsx
import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Download, Eye, X, Loader2, AlertCircle,
  Search, Calendar, ChevronDown,
} from 'lucide-react';
import axios from 'axios';

const API = 'https://trial.iphrdafrica.org/api';

const VIEWS_KEY = 'publication_views';

// Cooldown (ms) — a publication can only be counted once per window.
// Set to Infinity if you only ever want the FIRST view counted.
const VIEW_COOLDOWN_MS = 30 * 1000;

const getFullUrl = (url) =>
  !url ? null : url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;

// ---- localStorage view-tracking helpers ----
const getMap = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch { return {}; }
};

// Returns { counted, count } — respects cooldown
const tryIncrementView = (id) => {
  const map = getMap(VIEWS_KEY);
  const now = Date.now();
  const entry = map[id];
  const last = entry && typeof entry === 'object' ? entry.last || 0 : 0;
  const count = entry && typeof entry === 'object' ? entry.count || 0 : (entry || 0);

  if (now - last < VIEW_COOLDOWN_MS) return { counted: false, count };

  const next = { count: count + 1, last: now };
  map[id] = next;
  try { localStorage.setItem(VIEWS_KEY, JSON.stringify(map)); } catch {}
  return { counted: true, count: next.count };
};

// Read a count regardless of old (number) or new ({count,last}) shape
const getViewCount = (id) => {
  const entry = getMap(VIEWS_KEY)[id];
  if (entry && typeof entry === 'object') return entry.count || 0;
  return typeof entry === 'number' ? entry : 0;
};

const Publications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeYear, setActiveYear] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [preview, setPreview] = useState(null);
  const [viewsMap, setViewsMap] = useState(() => getMap(VIEWS_KEY));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/reports`);
        setItems(data);
      } catch (err) {
        setError(err.message || 'Failed to load publications');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const years = useMemo(() => {
    const set = new Set(items.map((p) => p.year).filter(Boolean));
    return ['All', ...Array.from(set).sort((a, b) => b - a)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = items.filter((p) => {
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      const matchesYear = activeYear === 'All' || String(p.year) === String(activeYear);
      return matchesSearch && matchesYear;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date_posted) - new Date(a.date_posted);
      if (sortBy === 'oldest') return new Date(a.date_posted) - new Date(b.date_posted);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [items, search, activeYear, sortBy]);

  useEffect(() => {
    document.body.style.overflow = preview ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [preview]);

  const handleView = (pub) => {
    tryIncrementView(pub.id);
    setViewsMap(getMap(VIEWS_KEY));
    setPreview(pub);
  };

  const label = (n, singular) => `${n} ${singular}${n === 1 ? '' : 's'}`;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <section className="bg-iphrd-green text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 break-words">
              Publications
            </h1>
            <p className="text-base md:text-lg text-white/85">
              Magazines, reports, situational awareness and resources from our work across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* ============ TOOLBAR ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-iphrd-green focus:ring-2 focus:ring-iphrd-green/15 outline-none text-sm transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-700"
                  aria-label="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={activeYear}
                  onChange={(e) => setActiveYear(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-iphrd-green/20 cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y === 'All' ? 'All years' : y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-iphrd-green/20 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">A–Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ RESULTS ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loading && !error && (
          <p className="text-xs text-gray-500 mb-4">
            {filtered.length === 0
              ? 'No results'
              : `${filtered.length} ${filtered.length === 1 ? 'publication' : 'publications'}`}
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-iphrd-green" />
            <p className="text-sm">Loading…</p>
          </div>
        )}

        {error && (
          <div className="max-w-sm mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="max-w-sm mx-auto bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">No publications found</p>
            <p className="text-xs text-gray-500 mb-3">Try adjusting your search or filters.</p>
            {(search || activeYear !== 'All') && (
              <button
                onClick={() => { setSearch(''); setActiveYear('All'); }}
                className="text-xs font-semibold text-iphrd-green hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ============ COMPACT GRID ============ */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((pub) => {
              const views = viewsMap[pub.id]?.count ?? getViewCount(pub.id);

              return (
                <article
                  key={pub.id}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-iphrd-green/40 hover:shadow-lg transition-all duration-200 flex flex-col min-w-0"
                >
                  {/* Compact header strip — solid green */}
                  <div className="relative h-24 bg-iphrd-green flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white/90" strokeWidth={1.75} />
                    {pub.year && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wide bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded-full ring-1 ring-white/30">
                        {pub.year}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-iphrd-green transition-colors break-words">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 flex-1 mb-3 break-words">
                      {pub.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(pub.date_posted).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Eye className="w-3 h-3" />
                        {label(views, 'view')}
                      </span>
                    </div>

                    <div className="flex gap-1.5 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleView(pub)}
                        className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 text-xs font-semibold text-gray-700 hover:text-iphrd-green hover:bg-iphrd-green/5 px-2 py-1.5 rounded-md transition"
                      >
                        <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                        View
                      </button>
                      <a
                        href={getFullUrl(pub.file_url)}
                        download
                        className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 text-xs font-semibold bg-iphrd-green hover:bg-iphrd-green/90 text-white px-2 py-1.5 rounded-md transition"
                      >
                        <Download className="w-3.5 h-3.5 flex-shrink-0" />
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ============ PDF PREVIEW MODAL ============ */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-iphrd-green">
              <h2 className="text-sm font-bold text-white truncate pr-3">
                {preview.title}
              </h2>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={getFullUrl(preview.file_url)}
                  download
                  className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreview(null)}
                  className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 overflow-hidden">
              <iframe
                src={getFullUrl(preview.file_url)}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publications;