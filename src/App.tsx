import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { CategoryCard } from './components/CategoryCard';
import { CalculatorCard } from './components/CalculatorCard';
import { CalculatorPage } from './components/CalculatorPage';
import { SearchModal } from './components/SearchModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Toast, ToastMessage } from './components/Toast';
import { HomeQuickCalculator } from './components/HomeQuickCalculator';
import { CATEGORIES } from './data/categories';
import {
  ALL_CALCULATORS,
  CALCULATORS_BY_ID,
  CALCULATORS_BY_CATEGORY,
  getPopularCalculators,
  getFeaturedCalculators
} from './data/calculators';
import {
  getFavorites,
  toggleFavorite,
  getHistory,
  addHistory,
  clearHistory,
  getStoredTheme,
  setStoredTheme
} from './utils/storage';
import { updateSEO } from './utils/seo';
import { CategoryId, HistoryItem } from './types/calculator';
import { Sparkles, ArrowRight, Grid, Heart, History, Filter } from 'lucide-react';

const resolveCurrentRoute = () => {
  if (typeof window === 'undefined') return '/';
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }
  const p = window.location.pathname || '/';
  if (p.endsWith('/index.html')) return '/';
  return p;
};

export const App: React.FC = () => {
  // Navigation & Routing State
  const [currentPath, setCurrentPath] = useState<string>(resolveCurrentRoute);
  const [theme, setTheme] = useState<'light' | 'dark'>(getStoredTheme);
  const [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [history, setHistory] = useState<HistoryItem[]>(getHistory);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Filters & Search query
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [restoredInputs, setRestoredInputs] = useState<Record<string, any> | undefined>(undefined);

  // Apply Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  }, [theme]);

  // Handle Browser Back / Forward and Hash changes
  useEffect(() => {
    const handleRouteSync = () => {
      setCurrentPath(resolveCurrentRoute());
    };
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show Toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Navigate function
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Favorite toggle
  const handleToggleFavorite = (calcId: string) => {
    const updated = toggleFavorite(calcId);
    setFavorites(updated);
    const isFav = updated.includes(calcId);
    showToast(isFav ? 'Added to favorites!' : 'Removed from favorites', isFav ? 'success' : 'info');
  };

  // Save to history
  const handleSaveHistory = (
    calcId: string,
    calcSlug: string,
    calcTitle: string,
    inputs: Record<string, any>,
    primaryResult: string
  ) => {
    const updated = addHistory({
      calcId,
      calcSlug,
      calcTitle,
      inputs,
      primaryResult
    });
    setHistory(updated);
  };

  // Clear history
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    showToast('Calculation history cleared', 'info');
  };

  // Restore calculation from history
  const handleRestoreCalculation = (item: HistoryItem) => {
    setRestoredInputs(item.inputs);
    navigate(`/calculators/${item.calcSlug}`);
    showToast(`Restored calculation for ${item.calcTitle}`, 'info');
  };

  // Parse Current Route
  let currentCalculator = null;
  let currentCategoryObj = null;

  if (currentPath.startsWith('/calculators/')) {
    const slug = currentPath.replace('/calculators/', '').split('/')[0];
    currentCalculator = CALCULATORS_BY_ID.get(slug);
  } else if (currentPath.startsWith('/category/')) {
    const catSlug = currentPath.replace('/category/', '').split('/')[0];
    currentCategoryObj = CATEGORIES.find((c) => c.slug === catSlug);
  }

  // Update SEO Title and Meta
  useEffect(() => {
    if (currentCalculator) {
      updateSEO(currentCalculator);
    } else if (currentCategoryObj) {
      updateSEO(undefined, currentCategoryObj.name);
    } else {
      updateSEO();
    }
  }, [currentCalculator, currentCategoryObj, currentPath]);

  // Compute displayed calculators on Homepage or Category page
  let displayedCalculators = ALL_CALCULATORS;
  if (currentCategoryObj) {
    displayedCalculators = CALCULATORS_BY_CATEGORY.get(currentCategoryObj.id) || [];
  } else if (selectedCategory) {
    displayedCalculators = CALCULATORS_BY_CATEGORY.get(selectedCategory as CategoryId) || [];
  }

  return (
    <div className="app-layout">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        favoritesCount={favorites.length}
        historyCount={history.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        currentRoute={currentPath}
        onNavigate={navigate}
      />

      <main>
        {/* Route 1: Specific Calculator Page */}
        {currentCalculator ? (
          <CalculatorPage
            calc={currentCalculator}
            isFavorite={favorites.includes(currentCalculator.id)}
            onToggleFavorite={handleToggleFavorite}
            onSaveHistory={handleSaveHistory}
            onSelectCalculator={(slug) => {
              setRestoredInputs(undefined);
              navigate(`/calculators/${slug}`);
            }}
            onShowToast={showToast}
            initialInputs={restoredInputs}
          />
        ) : currentCategoryObj ? (
          /* Route 2: Category Filtered Page */
          <div className="container" style={{ padding: '2.5rem 0 4rem' }}>
            <nav className="breadcrumbs" style={{ marginBottom: '1.5rem' }}>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
              <span className="breadcrumb-separator">/</span>
              <span>Category</span>
              <span className="breadcrumb-separator">/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentCategoryObj.name}</span>
            </nav>

            <div style={{ marginBottom: '2.5rem' }}>
              <h1>{currentCategoryObj.name} Calculators</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                {currentCategoryObj.description}
              </p>
            </div>

            <div className="calculator-grid">
              {displayedCalculators.map((calc) => (
                <CalculatorCard
                  key={calc.id}
                  calc={calc}
                  isFavorite={favorites.includes(calc.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={(slug) => navigate(`/calculators/${slug}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Route 3: Modern SaaS Homepage */
          <>
            <Hero
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenSearchModal={() => setIsSearchOpen(true)}
            />

            {/* Quick Interactive Calculator Workspace on Homepage */}
            <HomeQuickCalculator
              onSelectCalculator={(slug) => {
                setRestoredInputs(undefined);
                navigate(`/calculators/${slug}`);
              }}
              onSaveHistory={handleSaveHistory}
              onShowToast={showToast}
            />

            {/* Popular Calculators Showcase */}
            {!selectedCategory && (
              <section className="section" style={{ background: 'var(--bg-surface-subtle)' }}>
                <div className="container">
                  <div className="section-header">
                    <div>
                      <span className="badge badge-popular" style={{ marginBottom: '0.5rem' }}>
                        <Sparkles size={13} /> Trending Now
                      </span>
                      <h2 className="section-title">Popular Calculators</h2>
                      <p className="section-subtitle">The most frequently used tools by students, professionals, and home owners.</p>
                    </div>
                  </div>

                  <div className="calculator-grid">
                    {getPopularCalculators(6).map((calc) => (
                      <CalculatorCard
                        key={calc.id}
                        calc={calc}
                        isFavorite={favorites.includes(calc.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={(slug) => navigate(`/calculators/${slug}`)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All 15 Categories Grid */}
            <section className="section">
              <div className="container">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Browse by Category</h2>
                    <p className="section-subtitle">Over 15 categories covering finance, math, construction, fitness, science, and everyday life.</p>
                  </div>
                </div>

                <div className="category-grid">
                  {CATEGORIES.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      isSelected={selectedCategory === cat.id}
                      onSelect={(catId) => {
                        navigate(`/category/${cat.slug}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Calculators Grid */}
            <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="container">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">
                      {selectedCategory ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.name} Calculators` : 'Explore All Calculators'}
                    </h2>
                    <p className="section-subtitle">
                      Showing {displayedCalculators.length} verified calculators with formulas, examples, and step-by-step guides.
                    </p>
                  </div>
                  {selectedCategory && (
                    <button className="btn btn-secondary" onClick={() => setSelectedCategory(null)}>
                      Clear Category Filter
                    </button>
                  )}
                </div>

                <div className="calculator-grid">
                  {displayedCalculators.map((calc) => (
                    <CalculatorCard
                      key={calc.id}
                      calc={calc}
                      isFavorite={favorites.includes(calc.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(slug) => navigate(`/calculators/${slug}`)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={(slug) => {
          setIsSearchOpen(false);
          navigate(`/calculators/${slug}`);
        }}
      />

      {/* Favorites Slide-over */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onSelectCalculator={(slug) => navigate(`/calculators/${slug}`)}
      />

      {/* History Slide-over */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRestoreCalculation={handleRestoreCalculation}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} />
    </div>
  );
};
