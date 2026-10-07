import React, { useState } from 'react';
import { Search, X, Sparkles, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { Category } from '../types/calculator';

interface HeroProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSearchModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenSearchModal
}) => {
  return (
    <section className="hero-section">
      <div className="container hero-content">
        {/* Pro Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-primary">
            <Sparkles size={13} /> The Complete Web Calculator Suite
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="hero-title">
          All Your Calculators in <span className="text-gradient">One Place</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Free, fast and accurate online calculators for everyday life, education, business, finance, health and more.
        </p>

        {/* Large Hero Search Box */}
        <div className="hero-search-box">
          <div className="hero-search-input-wrapper">
            <Search size={22} className="hero-search-icon" />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search for a calculator... (e.g. loan, bmi, mortgage, binary, percentage)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={onOpenSearchModal}
              id="hero-search-input"
              aria-label="Search for a calculator"
            />
            {searchQuery && (
              <button
                className="hero-search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="hero-pills">
          <button
            className={`pill-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            All Categories ({categories.reduce((acc, c) => acc + (c.count || 0), 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <span>{cat.name}</span>
              <span style={{ opacity: 0.65, fontSize: '0.75rem' }}>({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">150+</span>
            <span className="stat-label">Working Calculators</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15</span>
            <span className="stat-label">Specialized Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Free & Instant</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">External API Delays</span>
          </div>
        </div>
      </div>
    </section>
  );
};
