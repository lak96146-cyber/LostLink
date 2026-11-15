import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { ItemResponse, ItemType } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import {
  Search,
  Filter,
  Mic,
  MicOff,
  Image,
  Tag,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'ID cards',
  'Wallets',
  'Documents',
  'Bags',
  'Books',
  'Clothing',
  'Accessories',
  'Keys',
  'Jewellery',
  'Bottles',
  'Other',
];

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);

  // Filters state
  const [query, setQuery] = useState<string>(searchParams.get('query') || '');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Voice Search State
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    fetchItems();
  }, [typeFilter, categoryFilter, locationFilter, currentPage]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const type = typeFilter === 'ALL' ? undefined : typeFilter;
      const category = categoryFilter === 'All Categories' ? undefined : categoryFilter;
      const location = locationFilter.trim() ? locationFilter.trim() : undefined;
      const q = query.trim() ? query.trim() : undefined;

      const res = await api.getItems({
        type,
        category,
        location,
        query: q,
        page: currentPage,
        size: 12,
      });

      setItems(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error('Failed to fetch items', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchItems();
  };

  // Browser Voice Search integration
  const toggleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use the text search bar.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        fetchItems();
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Campus Item Discovery</h1>
        <p className="text-xs text-slate-400 mt-1">Search, filter, and discover lost and found belongings across CGC Jhanjeri</p>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
        {/* Search Input & Actions */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, title, brand, description..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  fetchItems();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            title={isListening ? 'Listening...' : 'Voice Search'}
            className={`p-2.5 rounded-xl border transition ${
              isListening
                ? 'bg-rose-600/30 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
          >
            Search
          </button>
        </form>

        {/* Filter Badges & Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
          {/* Type Toggle: All, Lost, Found */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/10 text-xs font-medium">
            {['ALL', 'LOST', 'FOUND'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  setCurrentPage(0);
                }}
                className={`px-3 py-1 rounded-lg transition ${
                  typeFilter === t
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Location Filter Input */}
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by building..."
              className="bg-slate-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          {/* Reset Filters */}
          {(typeFilter !== 'ALL' || categoryFilter !== 'All Categories' || locationFilter || query) && (
            <button
              onClick={() => {
                setTypeFilter('ALL');
                setCategoryFilter('All Categories');
                setLocationFilter('');
                setQuery('');
                setCurrentPage(0);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 ml-auto transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Items Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-white/10 text-slate-400">
          <Search className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No items match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing filters, or report a lost item to alert the campus community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={(it) => setSelectedItem(it)}
              onClaim={(it) => setSelectedItem(it)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-mono px-2">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Item Details / Claim Modal */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onClaimSuccess={() => fetchItems()}
      />
    </div>
  );
};
