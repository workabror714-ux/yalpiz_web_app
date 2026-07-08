import React from 'react';
import { Search, Flame, Coffee, Salad, Sparkles, Box, LayoutGrid, UtensilsCrossed } from 'lucide-react';
import { CategoryType, Language } from '../types';
import { Category } from '../api';
import { TRANSLATIONS } from '../data';

// Kategoriya nomiga qarab mos ikonka (dinamik kategoriyalar uchun)
function iconFor(name: string): React.ComponentType<{ className?: string }> {
  const n = name.toLowerCase();
  if (/osh|palov|guruch/.test(n)) return Sparkles;
  if (/mangal|kabob|shash|gril/.test(n)) return Flame;
  if (/salat|nordon|non/.test(n)) return Salad;
  if (/ichim|choy|qahva|kofe|coffee|drink|sok|напит/.test(n)) return Coffee;
  if (/set|plam|kombo|combo/.test(n)) return Box;
  return UtensilsCrossed;
}

interface CategoryNavProps {
  lang: Language;
  categories: Category[];
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CategoryNav({
  lang,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: CategoryNavProps) {
  const t = TRANSLATIONS[lang];

  const catList: { id: CategoryType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: t.cat_all, icon: LayoutGrid },
    ...categories.map((c) => ({
      id: c.id,
      label: lang === 'uz' ? c.label_uz : c.label_ru,
      icon: iconFor(c.id),
    })),
  ];

  return (
    <div className="space-y-6">
      
      {/* Category Selection Scrolling Chips */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-3">
          {catList.map((cat) => {
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
