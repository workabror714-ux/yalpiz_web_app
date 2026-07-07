import React from 'react';
import { Search, Flame, Coffee, Salad, Sparkles, Box, LayoutGrid } from 'lucide-react';
import { CategoryType, Language } from '../types';
import { TRANSLATIONS } from '../data';

interface CategoryNavProps {
  lang: Language;
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CategoryNav({
  lang,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: CategoryNavProps) {
  const t = TRANSLATIONS[lang];

  const categories: { id: CategoryType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: t.cat_all, icon: LayoutGrid },
    { id: 'osh', label: t.cat_osh, icon: Sparkles },
    { id: 'mangal', label: t.cat_mangal, icon: Flame },
    { id: 'salatlar', label: t.cat_salatlar, icon: Salad },
    { id: 'ichimliklar', label: t.cat_ichimliklar, icon: Coffee },
    { id: 'setlar', label: t.cat_setlar, icon: Box },
  ];

  return (
    <div className="space-y-6">
      
      {/* Category Selection Scrolling Chips */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.03]'
                    : 'bg-white hover:bg-brand-primary/5 text-brand-dark/80 border border-brand-primary/5 hover:border-brand-primary/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-accent fill-current' : 'text-brand-primary'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Realtime Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 h-5 text-brand-muted" />
        </div>
        <input
          id="menu-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="block w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/10 rounded-2xl text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent shadow-sm text-sm sm:text-base font-sans"
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-brand-muted hover:text-brand-primary"
          >
            {lang === 'uz' ? 'Tozalash' : 'Очистить'}
          </button>
        )}
      </div>

    </div>
  );
}
