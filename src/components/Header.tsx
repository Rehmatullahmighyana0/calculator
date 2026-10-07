import React, { useState } from 'react';
import { Search, Heart, History, Moon, Sun, Menu, X, Calculator, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  favoritesCount: number;
  historyCount: number;
  onOpenSearch: () => void;
  onOpenFavorites: () => void;
  onOpenHistory: () => void;
  currentRoute: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  favoritesCount,
  historyCount,
  onOpenSearch,
  onOpenFavorites,
  onOpenHistory,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand */}
        <a
          href="/"
          className="brand-link"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          aria-label="CalcHub Home"
        >
          <div className="brand-icon">
            <Calculator size={22} />
          </div>
          <span>
            Calc<span className="text-gradient">Hub</span>
          </span>
          <span className="brand-tag">PRO</span>
        </a>

        {/* Search Bar Trigger */}
        <button
          className="search-trigger-btn"
          onClick={onOpenSearch}
          aria-label="Search calculators (Press Ctrl+K)"
        >
          <Search size={16} />
          <span>Search 150+ calculators...</span>
          <span className="search-kbd">Ctrl K</span>
        </button>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Favorites Button */}
          <button
            className="icon-btn"
            onClick={onOpenFavorites}
            title="Saved Favorites"
            aria-label="View Favorites"
          >
            <Heart size={19} />
            {favoritesCount > 0 && <span className="icon-badge-counter">{favoritesCount}</span>}
          </button>

          {/* History Button */}
          <button
            className="icon-btn"
            onClick={onOpenHistory}
            title="Calculation History"
            aria-label="View History"
          >
            <History size={19} />
            {historyCount > 0 && <span className="icon-badge-counter">{historyCount}</span>}
          </button>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="icon-btn mobile-toggle"
            style={{ display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div className="mobile-nav-header">
            <span style={{ fontWeight: 700 }}>All Categories</span>
            <button className="icon-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="mobile-categories-list">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="mobile-category-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(`/category/${cat.slug}`);
                }}
              >
                <span>{cat.name}</span>
                <span className="badge badge-primary">{cat.count}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
